'use strict';

// ============================================================
// CONSTANTS
// ============================================================
var CLAUDE_API = 'https://api.anthropic.com/v1/messages';
var CLAUDE_MODEL = 'claude-haiku-4-5-20251001';

// Reuse html2canvas CDN from app.js
var GEN_H2C_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';

// ============================================================
// STATE
// ============================================================
var genState = {
  selectedTemplate: null,
  aiHTML: null,        // HTML returned by AI creative generation
  previewTimer: null,
  exportScale: 2
};

// ============================================================
// DOM
// ============================================================
var gd = {};  // populated on init

function genInit() {
  var ids = [
    'genTemplateGrid','genHeadline','genSubtitle','genCta','genTag',
    'genDomain','genClickUrl',
    'genValue1','genValue2','genValue3','genValue4','genDisclaimer',
    'genPrimaryColor','genSecondaryColor',
    'genSizeSelect','genCustomSizeField','genCustomWidth','genCustomHeight',
    'genPreviewIframe','genPreviewWrapper','genPreviewEmpty','genPreviewArea','genPreviewMeta',
    'genApiKey','genCopyContext','genBtnCopy','genCreativeBrief','genBtnCreative',
    'genAiMessage','genCopyResults','genExportPNG','genExportHTML','genExportGIF','genScaleGroup',
    'genAiHTMLPanel','genAiHTMLCode','genBtnApplyHTML','genBtnEditHTML'
  ];
  ids.forEach(function(id) { gd[id] = document.getElementById(id); });

  buildTemplateGrid();
  bindFormListeners();
  bindAIListeners();
  bindExport();
  loadApiKey();

  // Select first template
  if (TEMPLATES && TEMPLATES.length > 0) selectTemplate(TEMPLATES[0]);

  // Scale selector
  document.querySelectorAll('#genScaleGroup .btn-option').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('#genScaleGroup .btn-option').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      genState.exportScale = parseInt(btn.dataset.scale, 10);
    });
  });

  window.addEventListener('resize', function() {
    if (document.getElementById('app-generator').style.display !== 'none') fitGenPreview();
  });
}

// ============================================================
// TEMPLATE GRID
// ============================================================
function buildTemplateGrid() {
  if (!gd.genTemplateGrid || !TEMPLATES) return;
  gd.genTemplateGrid.innerHTML = '';

  TEMPLATES.forEach(function(tpl) {
    var item = document.createElement('div');
    item.className = 'template-item';
    item.dataset.id = tpl.id;

    // Render thumbnail at 280x180 for consistent grid
    var thumbHTML = tpl.render({
      headline: 'Headline', subtitle: 'Subtítulo do anúncio', cta: 'Clique Aqui',
      primaryColor: '#7c3aed', secondaryColor: '#10b981', tag: 'Destaque',
      width: 280, height: 180
    });

    var iframe = document.createElement('iframe');
    iframe.setAttribute('sandbox', 'allow-scripts');
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('tabindex', '-1');
    iframe.srcdoc = thumbHTML;
    iframe.style.cssText = 'width:280px;height:180px;border:none;transform:scale(.5);transform-origin:top left;pointer-events:none;';

    var thumb = document.createElement('div');
    thumb.className = 'template-thumb';
    thumb.appendChild(iframe);

    var name = document.createElement('span');
    name.className = 'template-name';
    name.textContent = tpl.name;

    var desc = document.createElement('span');
    desc.className = 'template-desc';
    desc.textContent = tpl.desc;

    item.appendChild(thumb);
    item.appendChild(name);
    item.appendChild(desc);
    item.addEventListener('click', function() { selectTemplate(tpl); });
    gd.genTemplateGrid.appendChild(item);
  });
}

function selectTemplate(tpl) {
  genState.selectedTemplate = tpl;
  genState.aiHTML = null;

  document.querySelectorAll('.template-item').forEach(function(el) {
    el.classList.toggle('selected', el.dataset.id === tpl.id);
  });

  if (gd.genAiHTMLPanel) gd.genAiHTMLPanel.style.display = 'none';
  schedulePreviewUpdate(0);
}

// ============================================================
// FORM / SETTINGS
// ============================================================
function bindFormListeners() {
  var fields = [
    'genHeadline','genSubtitle','genCta','genTag',
    'genDomain','genClickUrl',
    'genValue1','genValue2','genValue3','genValue4','genDisclaimer',
    'genPrimaryColor','genSecondaryColor','genCustomWidth','genCustomHeight'
  ];
  fields.forEach(function(id) {
    var el = gd[id];
    if (!el) return;
    el.addEventListener('input', function() { schedulePreviewUpdate(180); });
    el.addEventListener('change', function() { schedulePreviewUpdate(0); });
  });

  if (gd.genSizeSelect) {
    gd.genSizeSelect.addEventListener('change', function() {
      var isCustom = gd.genSizeSelect.value === 'custom';
      if (gd.genCustomSizeField) gd.genCustomSizeField.style.display = isCustom ? 'block' : 'none';
      schedulePreviewUpdate(0);
    });
  }
}

function getGenParams() {
  var sizeVal = gd.genSizeSelect ? gd.genSizeSelect.value : '336x280';
  var width, height;
  if (sizeVal === 'custom') {
    width  = Math.max(1, parseInt((gd.genCustomWidth  || {}).value, 10) || 336);
    height = Math.max(1, parseInt((gd.genCustomHeight || {}).value, 10) || 280);
  } else {
    var parts = sizeVal.split('x').map(Number);
    width = parts[0]; height = parts[1];
  }
  return {
    headline:       (gd.genHeadline       || {}).value || '',
    subtitle:       (gd.genSubtitle       || {}).value || '',
    cta:            (gd.genCta            || {}).value || '',
    tag:            (gd.genTag            || {}).value || '',
    domain:         (gd.genDomain         || {}).value || '',
    clickUrl:       (gd.genClickUrl       || {}).value || '#',
    value1:         (gd.genValue1         || {}).value || '',
    value2:         (gd.genValue2         || {}).value || '',
    value3:         (gd.genValue3         || {}).value || '',
    value4:         (gd.genValue4         || {}).value || '',
    disclaimer:     (gd.genDisclaimer     || {}).value || '',
    primaryColor:   (gd.genPrimaryColor   || {}).value || '#158809',
    secondaryColor: (gd.genSecondaryColor || {}).value || '#dcfce7',
    width, height
  };
}

// ============================================================
// PREVIEW
// ============================================================
function schedulePreviewUpdate(delay) {
  clearTimeout(genState.previewTimer);
  genState.previewTimer = setTimeout(function() { doUpdatePreview(); }, delay);
}

function doUpdatePreview() {
  var params = getGenParams();
  var html;

  if (genState.aiHTML) {
    html = genState.aiHTML;
  } else if (genState.selectedTemplate) {
    html = genState.selectedTemplate.render(params);
  } else {
    return;
  }

  var blob = new Blob([html], { type: 'text/html' });
  var url  = URL.createObjectURL(blob);

  if (gd.genPreviewIframe && gd.genPreviewIframe._blobUrl) {
    URL.revokeObjectURL(gd.genPreviewIframe._blobUrl);
  }
  if (gd.genPreviewIframe) {
    gd.genPreviewIframe._blobUrl = url;
    gd.genPreviewIframe.src = url;
    gd.genPreviewIframe.style.display = 'block';
  }
  if (gd.genPreviewEmpty) gd.genPreviewEmpty.style.display = 'none';
  if (gd.genPreviewWrapper) gd.genPreviewWrapper.style.display = 'flex';
  if (gd.genPreviewMeta) gd.genPreviewMeta.textContent = params.width + '×' + params.height + 'px';

  fitGenPreview();
}

function fitGenPreview() {
  if (!gd.genPreviewArea || !gd.genPreviewIframe) return;
  var params = getGenParams();
  var w = params.width, h = params.height;
  var aw = gd.genPreviewArea.clientWidth  - 48;
  var ah = gd.genPreviewArea.clientHeight - 48;
  var s  = Math.min(aw / w, ah / h, 1);

  gd.genPreviewIframe.style.width  = w + 'px';
  gd.genPreviewIframe.style.height = h + 'px';
  gd.genPreviewIframe.style.transform = 'scale(' + s + ')';
  if (gd.genPreviewWrapper) {
    gd.genPreviewWrapper.style.width  = Math.round(w * s) + 'px';
    gd.genPreviewWrapper.style.height = Math.round(h * s) + 'px';
  }
}

// ============================================================
// AI — SHARED
// ============================================================
function loadApiKey() {
  var saved = localStorage.getItem('adsup_apikey');
  if (saved && gd.genApiKey) gd.genApiKey.value = saved;
}

function saveApiKey() {
  var key = (gd.genApiKey || {}).value || '';
  if (key) localStorage.setItem('adsup_apikey', key);
}

function getApiKey() {
  saveApiKey();
  return ((gd.genApiKey || {}).value || '').trim();
}

async function callClaude(system, user, apiKey, maxTokens) {
  var res = await fetch(CLAUDE_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: maxTokens || 1536,
      system: system,
      messages: [{ role: 'user', content: user }]
    })
  });

  if (!res.ok) {
    var err = await res.json().catch(function() { return {}; });
    var msg = (err.error && err.error.message) || ('Erro ' + res.status);
    if (res.status === 401) msg = 'Chave da API inválida. Verifique em console.anthropic.com';
    if (res.status === 429) msg = 'Limite de requisições atingido. Aguarde um momento.';
    throw new Error(msg);
  }

  var data = await res.json();
  return data.content[0].text;
}

function bindAIListeners() {
  if (gd.genBtnCopy)     gd.genBtnCopy.addEventListener('click', generateCopy);
  if (gd.genBtnCreative) gd.genBtnCreative.addEventListener('click', generateCreative);
  if (gd.genBtnApplyHTML) gd.genBtnApplyHTML.addEventListener('click', applyAiHTML);
  if (gd.genBtnEditHTML) gd.genBtnEditHTML.addEventListener('click', editAiHTML);
  if (gd.genApiKey) gd.genApiKey.addEventListener('change', saveApiKey);
}

// ============================================================
// AI — COPY GENERATION
// ============================================================
async function generateCopy() {
  var apiKey = getApiKey();
  if (!apiKey) { showAiMsg('Insira sua chave da API Claude.', 'error'); return; }
  var context = (gd.genCopyContext || {}).value || '';
  if (!context.trim()) { showAiMsg('Descreva seu produto ou serviço.', 'error'); return; }

  setLoading(gd.genBtnCopy, true, '✦ Gerando...');
  clearCopyResults();

  try {
    var system = 'Você é um copywriter brasileiro especializado em publicidade digital de alto impacto.';
    var user = `Crie copy para anúncio display:

CONTEXTO: ${context}

Retorne APENAS JSON válido, sem markdown, exatamente neste formato:
{"headlines":["h1","h2","h3"],"subtitles":["s1","s2","s3"],"ctas":["c1","c2","c3"]}

- Headlines: máx 6 palavras, impactantes
- Subtítulos: máx 12 palavras, benefício claro
- CTAs: máx 4 palavras, ação direta`;

    var text = await callClaude(system, user, apiKey);
    var match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Resposta inesperada da IA. Tente novamente.');
    var copy = JSON.parse(match[0]);
    renderCopyResults(copy);
    showAiMsg('Clique em qualquer opção para aplicar.', 'success');
  } catch (e) {
    showAiMsg(e.message, 'error');
  } finally {
    setLoading(gd.genBtnCopy, false);
  }
}

function renderCopyResults(copy) {
  if (!gd.genCopyResults) return;
  gd.genCopyResults.innerHTML = '';

  var sections = [
    { title: 'Headlines', items: copy.headlines || [], fieldId: 'genHeadline' },
    { title: 'Subtítulos', items: copy.subtitles || [], fieldId: 'genSubtitle' },
    { title: 'CTAs', items: copy.ctas || [], fieldId: 'genCta' }
  ];

  sections.forEach(function(s) {
    var wrap = document.createElement('div');
    wrap.className = 'copy-section';

    var title = document.createElement('p');
    title.className = 'copy-section-title';
    title.textContent = s.title;
    wrap.appendChild(title);

    s.items.forEach(function(text) {
      var btn = document.createElement('button');
      btn.className = 'copy-option';
      btn.textContent = text;
      btn.addEventListener('click', function() {
        var field = document.getElementById(s.fieldId);
        if (field) { field.value = text; schedulePreviewUpdate(0); }
        wrap.querySelectorAll('.copy-option').forEach(function(b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
      });
      wrap.appendChild(btn);
    });

    gd.genCopyResults.appendChild(wrap);
  });

  gd.genCopyResults.style.display = 'block';
}

function clearCopyResults() {
  if (gd.genCopyResults) {
    gd.genCopyResults.innerHTML = '';
    gd.genCopyResults.style.display = 'none';
  }
}

// ============================================================
// AI — CREATIVE GENERATION
// ============================================================
async function generateCreative() {
  var apiKey = getApiKey();
  if (!apiKey) { showAiMsg('Insira sua chave da API Claude.', 'error'); return; }
  var brief = (gd.genCreativeBrief || {}).value || '';
  if (!brief.trim()) { showAiMsg('Descreva o criativo que deseja criar.', 'error'); return; }

  var params = getGenParams();
  setLoading(gd.genBtnCreative, true, '✦ Criando criativo...');

  try {
    var system = 'Você é um designer expert em HTML/CSS para banners de publicidade digital. Cria banners visualmente impactantes com HTML/CSS puro.';
    var user = `Crie um banner HTML/CSS completo e autossuficiente.

DIMENSÕES: ${params.width}×${params.height}px
COR PRIMÁRIA: ${params.primaryColor}
COR SECUNDÁRIA: ${params.secondaryColor}
BRIEFING: ${brief}

REGRAS OBRIGATÓRIAS:
- Use APENAS <style> embutido. ZERO recursos externos (sem CDN, sem fontes externas, sem imagens externas).
- html, body: margin:0; padding:0; overflow:hidden; width:${params.width}px; height:${params.height}px;
- Inclua pelo menos uma animação CSS com @keyframes.
- Tipografia: system-ui, Arial como fallback.
- Design profissional e impactante para publicidade digital.
- Retorne APENAS o código HTML. Sem explicações, sem markdown, sem blocos de código.`;

    var text = await callClaude(system, user, apiKey, 3000);

    // Strip markdown code blocks if present
    var html = text.replace(/^```(?:html)?\n?/i, '').replace(/\n?```$/i, '').trim();

    genState.aiHTML = html;

    // Show AI HTML panel
    if (gd.genAiHTMLPanel) {
      gd.genAiHTMLPanel.style.display = 'block';
      if (gd.genAiHTMLCode) {
        gd.genAiHTMLCode.value = html;
        gd.genAiHTMLCode.style.display = 'none'; // code view hidden by default
      }
    }

    schedulePreviewUpdate(0);
    showAiMsg('Criativo gerado! Veja o preview e exporte quando pronto.', 'success');
  } catch (e) {
    showAiMsg(e.message, 'error');
  } finally {
    setLoading(gd.genBtnCreative, false);
  }
}

function applyAiHTML() {
  if (!gd.genAiHTMLCode) return;
  var edited = gd.genAiHTMLCode.value.trim();
  if (!edited) return;
  genState.aiHTML = edited;
  schedulePreviewUpdate(0);
  showAiMsg('HTML aplicado ao preview.', 'success');
}

function editAiHTML() {
  if (!gd.genAiHTMLCode || !gd.genBtnApplyHTML) return;
  var visible = gd.genAiHTMLCode.style.display !== 'none';
  gd.genAiHTMLCode.style.display = visible ? 'none' : 'block';
  gd.genBtnEditHTML.textContent = visible ? '✎ Editar HTML' : '✎ Ocultar';
  gd.genBtnApplyHTML.style.display = visible ? 'none' : 'inline-flex';
}

// ============================================================
// EXPORT
// ============================================================
function bindExport() {
  if (gd.genExportPNG)  gd.genExportPNG.addEventListener('click', exportAsPNG);
  if (gd.genExportHTML) gd.genExportHTML.addEventListener('click', exportAsHTML);
  if (gd.genExportGIF)  gd.genExportGIF.addEventListener('click', exportAsGIF);
}

function getExportHTML() {
  var params = getGenParams();
  if (genState.aiHTML) return { html: genState.aiHTML, params: params };
  if (genState.selectedTemplate) return { html: genState.selectedTemplate.render(params), params: params };
  return null;
}

function exportAsHTML() {
  var result = getExportHTML();
  if (!result) return;
  var params = result.params;
  var html   = result.html;
  var blob   = new Blob([html], { type: 'text/html; charset=utf-8' });
  var url    = URL.createObjectURL(blob);
  var name   = 'criativo_' + params.width + 'x' + params.height + '.html';
  var a      = Object.assign(document.createElement('a'), { href: url, download: name });
  a.click();
  setTimeout(function() { URL.revokeObjectURL(url); }, 3000);
}

async function exportAsPNG() {
  var result = getExportHTML();
  if (!result) return;
  var params = result.params;
  var html   = result.html;

  // Show shared progress overlay
  var overlay  = document.getElementById('progressOverlay');
  var pTitle   = document.getElementById('progressTitle');
  var pDetail  = document.getElementById('progressDetail');
  var pFill    = document.getElementById('progressFill');
  var pCounter = document.getElementById('progressCounter');

  if (overlay) overlay.style.display = 'flex';
  if (pTitle)  pTitle.textContent  = 'Exportando como PNG...';
  if (pDetail) pDetail.textContent = params.width + '×' + params.height + 'px @ ' + genState.exportScale + 'x';
  if (pFill)   pFill.style.width   = '40%';
  if (pCounter) pCounter.textContent = '';

  try {
    // renderHTML is a global function from app.js
    var dataURL = await renderHTML(html, params.width, params.height, genState.exportScale, 800);
    if (pFill) pFill.style.width = '100%';
    await new Promise(function(r) { setTimeout(r, 300); });
    if (overlay) overlay.style.display = 'none';

    var name = 'criativo_' + params.width + 'x' + params.height + '@' + genState.exportScale + 'x.png';
    var a = document.createElement('a');
    a.href = dataURL;
    a.download = name;
    a.click();
  } catch (e) {
    if (overlay) overlay.style.display = 'none';
    showAiMsg('Erro ao exportar: ' + e.message, 'error');
  }
}

async function exportAsGIF() {
  var result = getExportHTML();
  if (!result) return;
  var params = result.params;
  var html   = result.html;

  var overlay  = document.getElementById('progressOverlay');
  var pTitle   = document.getElementById('progressTitle');
  var pDetail  = document.getElementById('progressDetail');
  var pFill    = document.getElementById('progressFill');
  var pCounter = document.getElementById('progressCounter');

  if (overlay) overlay.style.display = 'flex';
  if (pTitle)  pTitle.textContent  = 'Gerando GIF animado...';
  if (pDetail) pDetail.textContent = 'Carregando encoder e capturando frames...';
  if (pFill)   pFill.style.width   = '5%';
  if (pCounter) pCounter.textContent = '';

  var fps = 10, duration = 3000;

  try {
    var gifBlob = await htmlToGIF(html, params.width, params.height, {
      fps: fps,
      duration: duration,
      scale: genState.exportScale,
      onProgress: function(frame, total) {
        var pct = Math.round((frame / total) * 100);
        if (pFill)   pFill.style.width    = pct + '%';
        if (pDetail) pDetail.textContent  = params.width + '×' + params.height + 'px — ' + fps + 'fps · ' + (duration / 1000) + 's';
        if (pCounter) pCounter.textContent = 'Frame ' + (frame + 1) + ' / ' + total;
      }
    });

    if (pFill) pFill.style.width = '100%';
    await new Promise(function(r) { setTimeout(r, 300); });
    if (overlay) overlay.style.display = 'none';

    var name = 'criativo_' + params.width + 'x' + params.height + '_' + fps + 'fps.gif';
    var url  = URL.createObjectURL(gifBlob);
    var a    = document.createElement('a');
    a.href = url; a.download = name; a.click();
    setTimeout(function() { URL.revokeObjectURL(url); }, 5000);
  } catch (e) {
    if (overlay) overlay.style.display = 'none';
    showAiMsg('Erro ao gerar GIF: ' + e.message, 'error');
  }
}

// ============================================================
// UI HELPERS
// ============================================================
function showAiMsg(msg, type) {
  if (!gd.genAiMessage) return;
  gd.genAiMessage.textContent = msg;
  gd.genAiMessage.className = 'ai-msg ai-msg-' + (type || 'info');
  gd.genAiMessage.style.display = 'block';
  clearTimeout(gd.genAiMessage._timer);
  gd.genAiMessage._timer = setTimeout(function() {
    if (gd.genAiMessage) gd.genAiMessage.style.display = 'none';
  }, 6000);
}

function setLoading(btn, loading, label) {
  if (!btn) return;
  btn.disabled = loading;
  if (loading) {
    btn._orig = btn.innerHTML;
    btn.innerHTML = (label || 'Aguarde...');
  } else {
    if (btn._orig) btn.innerHTML = btn._orig;
  }
}

// Expose for app.js init call
window.genInit = genInit;
window.fitGenPreview = fitGenPreview;
