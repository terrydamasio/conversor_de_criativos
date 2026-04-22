'use strict';

// Templates baseados nos criativos reais da AdsUp.
// Parâmetros disponíveis:
// { headline, subtitle, cta, tag, domain, clickUrl,
//   value1, value2, value3, value4, disclaimer,
//   primaryColor, secondaryColor, width, height }

var TEMPLATES = [

  /* ──────────────────────────────────────────────
     1. CARD SIMULATOR  (creativo_1_usd.html)
     Card branco, chips de valor, CTA arredondado
  ────────────────────────────────────────────── */
  {
    id: 'card-simulator',
    name: 'Card Simulator',
    desc: 'Card branco com chips de valor',
    render: function (p) {
      var w = p.width || 336, h = p.height || 280;
      var s = Math.min(w / 336, h / 280);
      var sr = function (px) { return Math.round(px * s); };

      var pc         = p.primaryColor   || '#158809';
      var sc         = p.secondaryColor || '#dcfce7';
      var domain     = p.domain      || 'creditario.com';
      var badge      = p.tag         || 'Análisis rápida';
      var hl         = p.headline    || 'Simula los montos ahora';
      var sub        = p.subtitle    || 'Confirma tus datos y descubre cuánto puedes solicitar en pocos minutos.';
      var chip1      = p.value1      || 'Hasta $ 500.000';
      var chip2      = p.value2      || '100% en línea';
      var cta        = p.cta         || 'SIMULAR AHORA';
      var disclaimer = p.disclaimer  || '*Sujeto a análisis, verificación de datos y condiciones de la institución. Ejemplo ilustrativo.';
      var safeUrl    = (p.clickUrl || '#').replace(/&/g,'&amp;').replace(/"/g,'&quot;');

      return `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${w}px;height:${h}px;overflow:hidden;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;
  background:#f3f4f6;color:#0f172a;}
.banner{width:${sr(320)}px;height:${sr(264)}px;background:#fff;margin:${sr(8)}px auto;
  border-radius:${sr(14)}px;box-shadow:0 ${sr(6)}px ${sr(18)}px rgba(15,23,42,.12);
  padding:${sr(14)}px;display:flex;flex-direction:column;
  cursor:pointer;border:1px solid #e5e7eb;}
.top-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:${sr(10)}px;}
.brand{display:flex;align-items:center;gap:${sr(7)}px;font-size:${sr(12)}px;color:#111827;}
.brand-dot{width:${sr(10)}px;height:${sr(10)}px;border-radius:${sr(3)}px;background:${pc};}
.badge-pill{background:${pc};color:#fff;padding:${sr(4)}px ${sr(10)}px;
  border-radius:999px;font-size:${sr(11)}px;font-weight:600;white-space:nowrap;}
.title{font-size:${sr(17)}px;line-height:1.3;font-weight:700;margin-bottom:${sr(4)}px;}
.subtitle{font-size:${sr(13)}px;line-height:1.4;color:#4b5563;margin-bottom:${sr(12)}px;}
.chips{display:flex;gap:${sr(8)}px;margin-bottom:${sr(16)}px;}
.chip{padding:${sr(8)}px ${sr(10)}px;border-radius:${sr(9)}px;font-size:${sr(13)}px;
  font-weight:600;white-space:nowrap;}
.chip1{background:${sc};border:1px solid ${sc};color:${pc};}
.chip2{border:1px solid #e5e7eb;background:#f9fafb;border-radius:999px;font-weight:500;color:#374151;}
.cta-wrap{margin-top:auto;}
.btn{width:100%;border:none;border-radius:999px;padding:${sr(11)}px;
  font-size:${sr(14)}px;font-weight:700;text-align:center;
  background:${pc};color:#fff;box-shadow:0 ${sr(8)}px ${sr(18)}px ${pc}55;
  cursor:pointer;letter-spacing:.02em;}
.fp{margin-top:${sr(10)}px;font-size:${sr(9)}px;color:#9ca3af;line-height:1.35;}
</style></head>
<body data-href="${safeUrl}">
<div class="banner" onclick="var u=document.body.getAttribute('data-href');if(u&&u!='#')window.open(u,'_blank')">
  <div class="top-row">
    <div class="brand"><span class="brand-dot"></span><span>${domain}</span></div>
    <div class="badge-pill">${badge}</div>
  </div>
  <div class="title">${hl}</div>
  <div class="subtitle">${sub}</div>
  <div class="chips">
    <div class="chip chip1">${chip1}</div>
    <div class="chip chip2">${chip2}</div>
  </div>
  <div class="cta-wrap">
    <div class="btn">${cta}</div>
    <div class="fp">${disclaimer}</div>
  </div>
</div>
</body></html>`;
    }
  },

  /* ──────────────────────────────────────────────
     2. PRÉ-APROVADO  (creditario_2000_final.html)
     Valor destaque + CTA com animação bounce/shine
  ────────────────────────────────────────────── */
  {
    id: 'pre-approved',
    name: 'Pré-Aprovado',
    desc: 'Valor destaque + CTA animado',
    render: function (p) {
      var w = p.width || 336, h = p.height || 280;
      var s = Math.min(w / 336, h / 280);
      var sr = function (px) { return Math.round(px * s); };

      var pc         = p.primaryColor  || '#198754';
      var domain     = p.domain        || 'creditario.com';
      var badge      = p.tag           || 'PRÉ-APROVADO';
      var hl         = p.headline      || 'Consulte opções de crédito';
      var sub        = p.subtitle      || 'Confirme os dados e veja as melhores recomendações para o seu perfil.';
      var valueAmt   = p.value1        || '$500.000';
      var valueLabel = p.value2        || 'Valor de referência';
      var cta        = p.cta           || 'Ver opções';
      var disclaimer = p.disclaimer    || '*Valor ilustrativo sujeito a verificação e condições da instituição. Não somos uma instituição financeira. Plataforma de recomendação e conteúdo informativo.';
      var safeUrl    = (p.clickUrl || '#').replace(/&/g,'&amp;').replace(/"/g,'&quot;');

      return `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><style>
*{box-sizing:border-box;font-family:Arial,Helvetica,sans-serif}
html,body{margin:0;width:${w}px;height:${h}px;background:#fff;
  border:1px solid #dcdcdc;overflow:hidden;}
.ad{padding:${sr(16)}px;height:100%;display:flex;flex-direction:column;}
.top{display:flex;align-items:center;justify-content:space-between;margin-bottom:${sr(14)}px;}
.brand-wrap{display:flex;align-items:center;gap:${sr(6)}px;}
.brand-icon{width:${sr(10)}px;height:${sr(10)}px;background:${pc};border-radius:${sr(2)}px;}
.brand{font-weight:bold;font-size:${sr(14)}px;color:#000;}
.badge{background:#fff;color:${pc};font-size:${sr(11)}px;
  padding:${sr(4)}px ${sr(8)}px;border-radius:${sr(12)}px;
  font-weight:bold;border:1px solid ${pc};}
h1{font-size:${sr(19)}px;margin:0 0 ${sr(6)}px;color:#000;}
p{font-size:${sr(12)}px;margin:0 0 ${sr(12)}px;color:#444;line-height:1.4;}
.value-box{display:flex;align-items:center;gap:${sr(8)}px;margin-bottom:${sr(14)}px;}
.value{font-size:${sr(22)}px;font-weight:bold;
  padding:${sr(6)}px ${sr(12)}px;border:1px solid #dcdcdc;
  border-radius:${sr(6)}px;color:${pc};}
.vtag{font-size:${sr(11)}px;color:${pc};background:#e9f8f1;
  border-radius:20px;padding:${sr(4)}px ${sr(10)}px;font-weight:bold;}
.cta{display:block;text-align:center;background:${pc};color:#fff;
  font-size:${sr(16)}px;font-weight:bold;text-decoration:none;
  padding:${sr(14)}px;border-radius:${sr(8)}px;margin-bottom:${sr(10)}px;
  position:relative;overflow:hidden;cursor:pointer;border:none;width:100%;
  animation:bounce 2s infinite;}
.cta::after{content:"";position:absolute;top:0;left:-75%;width:50%;height:100%;
  background:linear-gradient(120deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.5) 50%,rgba(255,255,255,0) 100%);
  animation:shine 2.5s infinite;}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(${sr(-4)}px)}}
@keyframes shine{0%{left:-75%}100%{left:125%}}
.foot{font-size:${sr(10)}px;color:#777;line-height:1.3;margin-top:auto;}
.bold{font-weight:bold;}
</style></head>
<body data-href="${safeUrl}">
<div class="ad">
  <div class="top">
    <div class="brand-wrap">
      <div class="brand-icon"></div>
      <div class="brand">${domain}</div>
    </div>
    <div class="badge">${badge}</div>
  </div>
  <h1>${hl}</h1>
  <p>${sub}</p>
  <div class="value-box">
    <div class="value">${valueAmt}</div>
    <div class="vtag">${valueLabel}</div>
  </div>
  <button class="cta" onclick="var u=document.body.getAttribute('data-href');if(u&&u!='#')window.open(u,'_blank')">${cta}</button>
  <div class="foot">${disclaimer}</div>
</div>
</body></html>`;
    }
  },

  /* ──────────────────────────────────────────────
     3. GRADE DE VALORES  (laranja_Qual_valor.html)
     Status dot + domínio + grid 2×2 de valores
  ────────────────────────────────────────────── */
  {
    id: 'value-grid',
    name: 'Grade de Valores',
    desc: 'Grid 2×2 com seleção de valor',
    render: function (p) {
      var w = p.width || 336, h = p.height || 280;
      var s = Math.min(w / 336, h / 280);
      var sr = function (px) { return Math.round(px * s); };

      var pc         = p.primaryColor   || '#F97316';
      var sc         = p.secondaryColor || '#FFF4E5';
      var domain     = p.domain      || 'oguiadocredito.com';
      var hl         = p.headline    || 'Qual valor você precisa liberar?';
      var v1         = p.value1      || 'R$ 1.000';
      var v2         = p.value2      || 'R$ 1.500';
      var v3         = p.value3      || 'R$ 2.000';
      var v4         = p.value4      || 'R$ 2.500';
      var cta        = p.cta         || 'SIMULAR AGORA';
      var disclaimer = p.disclaimer  || '*Sujeito à análise, verificação de dados e condições da instituição.';
      var safeUrl    = (p.clickUrl || '#').replace(/&/g,'&amp;').replace(/"/g,'&quot;');

      return `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${w}px;height:${h}px;overflow:hidden;
  font-family:Arial,sans-serif;background:#fff;
  display:flex;flex-direction:column;align-items:center;}
.topinfo{width:84%;display:flex;align-items:center;padding-top:${sr(8)}px;}
.status-dot{width:${sr(10)}px;height:${sr(10)}px;background:#22c55e;
  border-radius:50%;margin-right:${sr(6)}px;flex-shrink:0;}
.domain{font-size:${sr(13)}px;color:#1a1a1a;font-weight:500;}
.content-wrap{width:84%;display:flex;flex-direction:column;margin-top:${sr(14)}px;}
h3{font-size:${sr(18)}px;font-weight:700;margin:0 0 ${sr(14)}px;color:#111827;}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:${sr(10)}px;width:100%;}
.card{background:${sc};color:${pc};border:1px solid ${pc}55;
  border-radius:${sr(10)}px;padding:${sr(10)}px 0;font-weight:700;
  font-size:${sr(15)}px;cursor:pointer;text-align:center;}
.confirm{margin-top:${sr(16)}px;width:100%;background:${pc};color:#fff;
  border:none;border-radius:${sr(8)}px;padding:${sr(12)}px 0;
  font-weight:700;font-size:${sr(16)}px;cursor:pointer;}
.footer{width:100%;font-size:${sr(11)}px;color:#6b7280;
  margin-top:${sr(10)}px;line-height:1.3;}
</style></head>
<body data-href="${safeUrl}">
<div class="topinfo">
  <div class="status-dot"></div>
  <div class="domain">${domain}</div>
</div>
<div class="content-wrap">
  <h3>${hl}</h3>
  <div class="grid">
    <button class="card" onclick="var u=document.body.getAttribute('data-href');if(u&&u!='#')window.open(u,'_blank')">${v1}</button>
    <button class="card" onclick="var u=document.body.getAttribute('data-href');if(u&&u!='#')window.open(u,'_blank')">${v2}</button>
    <button class="card" onclick="var u=document.body.getAttribute('data-href');if(u&&u!='#')window.open(u,'_blank')">${v3}</button>
    <button class="card" onclick="var u=document.body.getAttribute('data-href');if(u&&u!='#')window.open(u,'_blank')">${v4}</button>
  </div>
  <button class="confirm" onclick="var u=document.body.getAttribute('data-href');if(u&&u!='#')window.open(u,'_blank')">${cta}</button>
  <div class="footer">${disclaimer}</div>
</div>
</body></html>`;
    }
  },

  /* ──────────────────────────────────────────────
     4. BOTÕES EMPILHADOS  (simule_agora_v2.html)
     Centralizado, botões full-width com hover
  ────────────────────────────────────────────── */
  {
    id: 'stacked-buttons',
    name: 'Botões Empilhados',
    desc: 'Valores em botões verticais centralizados',
    render: function (p) {
      var w = p.width || 336, h = p.height || 280;
      var s = Math.min(w / 336, h / 280);
      var sr = function (px) { return Math.round(px * s); };

      var pc         = p.primaryColor  || '#2563eb';
      var hl         = p.headline   || 'Simule os valores agora';
      var v1         = p.value1     || 'R$ 1.000';
      var v2         = p.value2     || 'R$ 1.500';
      var v3         = p.value3     || 'R$ 2.000';
      var v4         = p.value4     || 'R$ 2.500';
      var disclaimer = p.disclaimer || '* Valor de referência sujeito a verificação de dados e condições da instituição. Exemplo ilustrativo.';
      var safeUrl    = (p.clickUrl || '#').replace(/&/g,'&amp;').replace(/"/g,'&quot;');

      return `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${w}px;height:${h}px;overflow:hidden;
  font-family:Arial,sans-serif;background:#fff;
  display:flex;flex-direction:column;justify-content:center;
  align-items:center;text-align:center;}
h3{font-size:${sr(18)}px;font-weight:700;margin:${sr(12)}px 0;color:#111827;}
.btn{display:block;width:80%;margin:${sr(6)}px auto;
  background:${pc};color:#fff;border:none;border-radius:${sr(8)}px;
  padding:${sr(10)}px 0;font-weight:700;cursor:pointer;
  transition:all .3s ease;font-size:${sr(16)}px;text-transform:uppercase;}
.btn:hover{transform:scale(1.05);box-shadow:0 0 ${sr(10)}px ${pc}55;}
.footer{font-size:${sr(10)}px;color:#6b7280;margin-top:${sr(10)}px;
  line-height:1.3;max-width:${sr(300)}px;padding:0 ${sr(10)}px;}
</style></head>
<body data-href="${safeUrl}">
  <h3>${hl}</h3>
  <button class="btn" onclick="var u=document.body.getAttribute('data-href');if(u&&u!='#')window.open(u,'_blank')">${v1}</button>
  <button class="btn" onclick="var u=document.body.getAttribute('data-href');if(u&&u!='#')window.open(u,'_blank')">${v2}</button>
  <button class="btn" onclick="var u=document.body.getAttribute('data-href');if(u&&u!='#')window.open(u,'_blank')">${v3}</button>
  <button class="btn" onclick="var u=document.body.getAttribute('data-href');if(u&&u!='#')window.open(u,'_blank')">${v4}</button>
  <div class="footer">${disclaimer}</div>
</body></html>`;
    }
  }

];
