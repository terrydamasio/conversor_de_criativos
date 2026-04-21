'use strict';

// ============================================================
// HTML2CANVAS CDN (injetado nos criativos para conversão)
// ============================================================
const H2C_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';

// Script de renderização injetado no iframe do criativo
const RENDER_SCRIPT = `
<script id="__adsup_engine">
(function () {
  function waitFor(fn, ms) {
    return new Promise(function (resolve, reject) {
      var t0 = Date.now();
      (function tick() {
        if (fn()) return resolve();
        if (Date.now() - t0 > (ms || 12000)) return reject(new Error('Timeout aguardando recurso'));
        setTimeout(tick, 40);
      })();
    });
  }

  window.addEventListener('message', function (e) {
    if (!e.data || e.data.type !== '__adsup_render') return;
    var d = e.data, src = e.source;

    waitFor(function () { return typeof html2canvas !== 'undefined'; })
      .then(function () {
        return document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
      })
      .then(function () {
        var imgs = [].slice.call(document.querySelectorAll('img'));
        return Promise.all(imgs.map(function (img) {
          return new Promise(function (r) {
            if (img.complete) return r();
            img.onload = r; img.onerror = r;
          });
        }));
      })
      .then(function () {
        return new Promise(function (r) { setTimeout(r, d.waitMs || 500); });
      })
      .then(function () {
        return html2canvas(document.documentElement, {
          width: d.width,
          height: d.height,
          scale: d.scale,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          logging: false,
          windowWidth: d.width,
          windowHeight: d.height,
          scrollX: 0,
          scrollY: 0
        });
      })
      .then(function (canvas) {
        src.postMessage({ type: '__adsup_result', id: d.id, dataURL: canvas.toDataURL('image/png') }, '*');
      })
      .catch(function (err) {
        src.postMessage({ type: '__adsup_error', id: d.id, message: err.message }, '*');
      });
  });

  // Avisa que o engine está pronto
  if (window.parent !== window) {
    window.parent.postMessage({ type: '__adsup_ready' }, '*');
  }
})();
<\/script>`;

// ============================================================
// STATE
// ============================================================
const state = {
  files: [],
  selected: null,
  scale: 2,
  results: []
};

// ============================================================
// DOM
// ============================================================
const $ = id => document.getElementById(id);

const dom = {
  uploadZone:      $('uploadZone'),
  fileInput:       $('fileInput'),
  filesSection:    $('filesSection'),
  filesList:       $('filesList'),
  clearFilesBtn:   $('clearFilesBtn'),
  sizeSelect:      $('sizeSelect'),
  customSizeField: $('customSizeField'),
  customWidth:     $('customWidth'),
  customHeight:    $('customHeight'),
  waitSelect:      $('waitSelect'),
  convertBtn:      $('convertBtn'),
  convertHint:     $('convertHint'),
  previewArea:     $('previewArea'),
  previewEmpty:    $('previewEmpty'),
  previewWrapper:  $('previewWrapper'),
  previewIframe:   $('previewIframe'),
  previewMeta:     $('previewMeta'),
  progressOverlay: $('progressOverlay'),
  progressTitle:   $('progressTitle'),
  progressDetail:  $('progressDetail'),
  progressFill:    $('progressFill'),
  progressCounter: $('progressCounter'),
  resultsOverlay:  $('resultsOverlay'),
  resultsGrid:     $('resultsGrid'),
  closeResultsBtn: $('closeResultsBtn'),
  closeResultsBtn2:$('closeResultsBtn2'),
  downloadAllBtn:  $('downloadAllBtn'),
};

// ============================================================
// INIT
// ============================================================
function init() {
  setupUpload();
  setupSettings();

  dom.clearFilesBtn.addEventListener('click', clearFiles);
  dom.convertBtn.addEventListener('click', startConversion);
  dom.closeResultsBtn.addEventListener('click', closeResults);
  dom.closeResultsBtn2.addEventListener('click', closeResults);
  dom.downloadAllBtn.addEventListener('click', downloadAll);

  window.addEventListener('resize', () => {
    if (state.selected) fitPreview();
  });
}

// ============================================================
// UPLOAD & FILE MANAGEMENT
// ============================================================
function setupUpload() {
  dom.uploadZone.addEventListener('click', e => {
    if (!e.target.classList.contains('file-input-hidden')) dom.fileInput.click();
  });
  dom.fileInput.addEventListener('change', e => addFiles(e.target.files));

  dom.uploadZone.addEventListener('dragover', e => {
    e.preventDefault();
    dom.uploadZone.classList.add('drag-over');
  });
  dom.uploadZone.addEventListener('dragleave', () => {
    dom.uploadZone.classList.remove('drag-over');
  });
  dom.uploadZone.addEventListener('drop', e => {
    e.preventDefault();
    dom.uploadZone.classList.remove('drag-over');
    addFiles(Array.from(e.dataTransfer.files).filter(f => f.name.toLowerCase().endsWith('.html')));
  });
}

function addFiles(fileList) {
  const incoming = Array.from(fileList).filter(f => f.name.toLowerCase().endsWith('.html'));
  incoming.forEach(f => {
    if (!state.files.find(x => x.name === f.name && x.size === f.size)) {
      state.files.push(f);
    }
  });
  renderFilesList();
  if (!state.selected && state.files.length > 0) selectFile(state.files[0]);
  updateConvertButton();
  dom.filesSection.style.display = state.files.length > 0 ? 'block' : 'none';
  dom.fileInput.value = '';
}

function renderFilesList() {
  dom.filesList.innerHTML = '';
  state.files.forEach((file, i) => {
    const item = document.createElement('div');
    item.className = 'file-item' + (state.selected === file ? ' selected' : '');

    const nameSpan = document.createElement('span');
    nameSpan.className = 'file-icon';
    nameSpan.textContent = '📄';

    const label = document.createElement('span');
    label.className = 'file-name';
    label.title = file.name;
    label.textContent = file.name;

    const rm = document.createElement('button');
    rm.className = 'file-remove';
    rm.title = 'Remover';
    rm.textContent = '✕';
    rm.addEventListener('click', e => { e.stopPropagation(); removeFile(i); });

    item.appendChild(nameSpan);
    item.appendChild(label);
    item.appendChild(rm);
    item.addEventListener('click', () => selectFile(file));
    dom.filesList.appendChild(item);
  });
}

function selectFile(file) {
  state.selected = file;
  renderFilesList();
  updatePreview(file);
}

function removeFile(i) {
  const removed = state.files[i];
  state.files.splice(i, 1);
  if (state.selected === removed) {
    state.selected = state.files[0] || null;
    state.selected ? updatePreview(state.selected) : clearPreview();
  }
  renderFilesList();
  updateConvertButton();
  dom.filesSection.style.display = state.files.length > 0 ? 'block' : 'none';
}

function clearFiles() {
  state.files = [];
  state.selected = null;
  dom.filesSection.style.display = 'none';
  clearPreview();
  updateConvertButton();
}

function updateConvertButton() {
  const has = state.files.length > 0;
  dom.convertBtn.disabled = !has;
  dom.convertHint.textContent = has
    ? `${state.files.length} arquivo(s) — clique para converter`
    : 'Faça upload de pelo menos um arquivo HTML';
}

// ============================================================
// SETTINGS
// ============================================================
function setupSettings() {
  dom.sizeSelect.addEventListener('change', () => {
    dom.customSizeField.style.display = dom.sizeSelect.value === 'custom' ? 'block' : 'none';
    if (state.selected) fitPreview();
  });

  dom.customWidth.addEventListener('input', () => { if (state.selected) fitPreview(); });
  dom.customHeight.addEventListener('input', () => { if (state.selected) fitPreview(); });

  document.querySelectorAll('.btn-option[data-scale]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.btn-option[data-scale]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.scale = parseInt(btn.dataset.scale, 10);
    });
  });
}

function getSize() {
  if (dom.sizeSelect.value === 'custom') {
    return {
      width: Math.max(1, parseInt(dom.customWidth.value, 10) || 336),
      height: Math.max(1, parseInt(dom.customHeight.value, 10) || 280)
    };
  }
  const [w, h] = dom.sizeSelect.value.split('x').map(Number);
  return { width: w, height: h };
}

// ============================================================
// PREVIEW
// ============================================================
let previewBlobURL = null;

async function updatePreview(file) {
  const html = await readAsText(file);
  if (previewBlobURL) URL.revokeObjectURL(previewBlobURL);
  previewBlobURL = URL.createObjectURL(new Blob([html], { type: 'text/html' }));

  dom.previewIframe.src = previewBlobURL;
  dom.previewEmpty.style.display = 'none';
  dom.previewWrapper.style.display = 'flex';

  fitPreview();
  const { width, height } = getSize();
  dom.previewMeta.textContent = `${file.name}  •  ${width}×${height}px`;
}

function fitPreview() {
  const { width, height } = getSize();
  const area = dom.previewArea;
  const aw = area.clientWidth  - 48;
  const ah = area.clientHeight - 48;
  const s  = Math.min(aw / width, ah / height, 1);

  dom.previewIframe.style.width  = width  + 'px';
  dom.previewIframe.style.height = height + 'px';
  dom.previewIframe.style.transform = `scale(${s})`;
  dom.previewWrapper.style.width  = Math.round(width  * s) + 'px';
  dom.previewWrapper.style.height = Math.round(height * s) + 'px';
}

function clearPreview() {
  dom.previewEmpty.style.display = 'flex';
  dom.previewWrapper.style.display = 'none';
  dom.previewMeta.textContent = '';
  if (previewBlobURL) { URL.revokeObjectURL(previewBlobURL); previewBlobURL = null; }
}

// ============================================================
// CONVERSION
// ============================================================
async function startConversion() {
  if (!state.files.length) return;
  const { width, height } = getSize();
  const scale  = state.scale;
  const waitMs = parseInt(dom.waitSelect.value, 10);

  state.results = [];
  showProgress();

  for (let i = 0; i < state.files.length; i++) {
    const file = state.files[i];
    const pct  = Math.round((i / state.files.length) * 100);
    updateProgress(
      `Convertendo ${i + 1} de ${state.files.length}`,
      file.name,
      pct,
      `${i + 1} / ${state.files.length}`
    );

    try {
      const html   = await readAsText(file);
      const dataURL = await renderHTML(html, width, height, scale, waitMs);
      state.results.push({
        filename: file.name.replace(/\.html?$/i, '') + `_${width}x${height}@${scale}x.png`,
        dataURL
      });
    } catch (err) {
      state.results.push({
        filename: file.name.replace(/\.html?$/i, '') + `_${width}x${height}.png`,
        error: err.message || 'Erro desconhecido'
      });
    }
  }

  updateProgress('Concluído!', '', 100, '');
  await delay(400);
  hideProgress();
  showResults();
}

// ============================================================
// RENDER ENGINE
// ============================================================
function renderHTML(htmlContent, width, height, scale, waitMs) {
  return new Promise((resolve, reject) => {
    // Inject size reset
    const styleTag = `<style id="__adsup_reset">
html,body{margin:0!important;padding:0!important;overflow:hidden!important;
width:${width}px!important;height:${height}px!important;}
</style>`;
    // html2canvas CDN
    const h2cTag = `<script src="${H2C_CDN}"><\/script>`;

    // Build modified HTML
    let modified = htmlContent;
    if (modified.includes('</head>')) {
      modified = modified.replace('</head>', styleTag + '\n' + h2cTag + '\n' + RENDER_SCRIPT + '\n</head>');
    } else if (/<body[\s>]/i.test(modified)) {
      modified = modified.replace(/<body[\s>]/i, m => styleTag + '\n' + h2cTag + '\n' + RENDER_SCRIPT + '\n' + m);
    } else {
      modified = styleTag + '\n' + h2cTag + '\n' + RENDER_SCRIPT + '\n' + modified;
    }

    const blobURL = URL.createObjectURL(new Blob([modified], { type: 'text/html' }));
    const iframe  = createHiddenIframe(width, height, blobURL);
    const rid     = Math.random().toString(36).slice(2);
    let   ready   = false;

    function cleanup() {
      clearTimeout(timer);
      window.removeEventListener('message', onMessage);
      if (document.body.contains(iframe)) document.body.removeChild(iframe);
      URL.revokeObjectURL(blobURL);
    }

    function sendRender() {
      if (ready) return;
      ready = true;
      try {
        iframe.contentWindow.postMessage(
          { type: '__adsup_render', id: rid, width, height, scale, waitMs }, '*'
        );
      } catch (_) { /* cross-origin guard */ }
    }

    function onMessage(e) {
      if (!e.data) return;
      if (e.data.type === '__adsup_ready') { sendRender(); return; }
      if (e.data.id !== rid) return;
      if (e.data.type === '__adsup_result') { cleanup(); resolve(e.data.dataURL); }
      else if (e.data.type === '__adsup_error') { cleanup(); reject(new Error(e.data.message)); }
    }

    // Fallback: trigger render after load even if __adsup_ready missed
    iframe.addEventListener('load', () => setTimeout(sendRender, 120));

    const timer = setTimeout(() => { cleanup(); reject(new Error('Timeout (30s): a renderização demorou demais')); }, 30000);
    window.addEventListener('message', onMessage);
    document.body.appendChild(iframe);
  });
}

function createHiddenIframe(width, height, src) {
  const iframe = document.createElement('iframe');
  iframe.style.cssText = [
    `position:fixed`,
    `left:-${width + 400}px`,
    `top:0`,
    `width:${width}px`,
    `height:${height}px`,
    `border:none`,
    `pointer-events:none`
  ].join(';');
  iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
  iframe.src = src;
  return iframe;
}

// ============================================================
// DOWNLOAD
// ============================================================
function downloadPNG(dataURL, filename) {
  const a = Object.assign(document.createElement('a'), { href: dataURL, download: filename });
  a.click();
}

async function downloadAll() {
  const ok = state.results.filter(r => !r.error);
  if (!ok.length) return;

  if (ok.length === 1) { downloadPNG(ok[0].dataURL, ok[0].filename); return; }

  if (typeof JSZip === 'undefined') {
    alert('JSZip não carregou. Baixe os arquivos individualmente.');
    return;
  }

  const zip = new JSZip();
  ok.forEach(r => zip.file(r.filename, r.dataURL.split(',')[1], { base64: true }));

  const blob = await zip.generateAsync({ type: 'blob' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: 'criativos_adsup.zip' });
  a.click();
  URL.revokeObjectURL(url);
}

// ============================================================
// UI — PROGRESS
// ============================================================
function showProgress() {
  dom.progressOverlay.style.display = 'flex';
  updateProgress('Preparando...', '', 0, '');
}

function hideProgress() {
  dom.progressOverlay.style.display = 'none';
}

function updateProgress(title, detail, pct, counter) {
  dom.progressTitle.textContent   = title;
  dom.progressDetail.textContent  = detail;
  dom.progressFill.style.width    = pct + '%';
  dom.progressCounter.textContent = counter;
}

// ============================================================
// UI — RESULTS
// ============================================================
function showResults() {
  dom.resultsGrid.innerHTML = '';

  state.results.forEach(r => {
    const item = document.createElement('div');
    item.className = 'result-item ' + (r.error ? 'result-error' : 'result-success');

    if (r.error) {
      item.innerHTML = `
        <div class="result-thumb result-thumb-error"><span>⚠️</span></div>
        <div class="result-info">
          <span class="result-filename">${esc(r.filename)}</span>
          <span class="result-error-msg">${esc(r.error)}</span>
        </div>`;
    } else {
      // Estimate size from base64
      const bytes = Math.round((r.dataURL.length * 3) / 4 / 1024);

      item.innerHTML = `
        <div class="result-thumb"><img src="${r.dataURL}" alt="${esc(r.filename)}"></div>
        <div class="result-info">
          <span class="result-filename">${esc(r.filename)}</span>
          <span class="result-size-info">~${bytes} KB</span>
          <button class="btn-download">⬇ Baixar PNG</button>
        </div>`;
      item.querySelector('.btn-download').addEventListener('click', () => downloadPNG(r.dataURL, r.filename));
    }

    dom.resultsGrid.appendChild(item);
  });

  const okCount = state.results.filter(r => !r.error).length;
  dom.downloadAllBtn.style.display = okCount > 1 ? 'inline-flex' : 'none';
  dom.resultsOverlay.style.display = 'flex';
}

function closeResults() {
  dom.resultsOverlay.style.display = 'none';
}

// ============================================================
// UTILITIES
// ============================================================
function readAsText(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload  = e => resolve(e.target.result);
    r.onerror = () => reject(new Error('Falha ao ler o arquivo ' + file.name));
    r.readAsText(file, 'utf-8');
  });
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function esc(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ============================================================
// START
// ============================================================
document.addEventListener('DOMContentLoaded', init);
