'use strict';

// Each template receives a params object:
// { headline, subtitle, cta, tag, primaryColor, secondaryColor, width, height }
// and returns a complete self-contained HTML string.

var TEMPLATES = [

  /* ──────────────────────────────────────────────
     1. GRADIENT BOLD
  ────────────────────────────────────────────── */
  {
    id: 'gradient-bold',
    name: 'Gradient Bold',
    desc: 'Vibrante e impactante',
    render: function (p) {
      var w = p.width || 336, h = p.height || 280;
      var pc = p.primaryColor || '#7c3aed';
      var sc = p.secondaryColor || '#10b981';
      var hl = p.headline || 'Headline Principal';
      var sub = p.subtitle || 'Subtítulo descritivo do produto';
      var cta = p.cta || 'Saiba Mais';
      var tag = p.tag || '';
      var wide = w / h > 2.2;

      if (wide) {
        var hls = Math.max(Math.round(h * 0.30), 13);
        var subs = Math.max(Math.round(h * 0.19), 10);
        var ctas = Math.max(Math.round(h * 0.21), 10);
        return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
*{margin:0;padding:0;box-sizing:border-box}html,body{width:${w}px;height:${h}px;overflow:hidden}
body{background:linear-gradient(90deg,#1a0030 0%,${pc} 55%,#001028 100%);
font-family:system-ui,-apple-system,Arial,sans-serif;display:flex;align-items:center;
justify-content:space-between;padding:0 ${Math.round(w * .03)}px;}
.texts{display:flex;flex-direction:column;gap:${Math.round(h * .06)}px;}
.hl{font-size:${hls}px;font-weight:900;color:#fff;letter-spacing:-.3px;line-height:1.05;}
.sub{font-size:${subs}px;color:rgba(255,255,255,.7);line-height:1.3;}
.cta{background:#fff;color:${pc};border:none;border-radius:${Math.max(Math.round(h * .12), 4)}px;
padding:${Math.round(h * .14)}px ${Math.round(w * .03)}px;font-size:${ctas}px;font-weight:700;
white-space:nowrap;cursor:pointer;flex-shrink:0;}
</style></head><body>
<div class="texts"><div class="hl">${hl}</div><div class="sub">${sub}</div></div>
<button class="cta">${cta}</button></body></html>`;
      }

      var hls = Math.max(Math.round(h * .13), 14);
      var subs = Math.max(Math.round(h * .052), 11);
      var ctas = Math.max(Math.round(h * .052), 11);
      var gap = Math.max(Math.round(h * .03), 6);
      var pad = Math.round(h * .07);
      return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
*{margin:0;padding:0;box-sizing:border-box}html,body{width:${w}px;height:${h}px;overflow:hidden;position:relative}
body{background:linear-gradient(145deg,#1a0030 0%,${pc} 55%,#001028 100%);
font-family:system-ui,-apple-system,Arial,sans-serif;display:flex;align-items:center;justify-content:center;}
.glow{position:absolute;width:65%;padding-bottom:65%;top:50%;left:50%;
transform:translate(-50%,-50%);border-radius:50%;
background:radial-gradient(circle,${pc}55 0%,transparent 65%);
animation:g 3s ease-in-out infinite;pointer-events:none;}
@keyframes g{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.7}
50%{transform:translate(-50%,-50%) scale(1.25);opacity:1}}
.wrap{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;
text-align:center;padding:${pad}px;gap:${gap}px;}
.badge{font-size:${Math.max(Math.round(h * .038), 9)}px;font-weight:600;letter-spacing:2px;
text-transform:uppercase;color:${sc};border:1px solid ${sc}55;
padding:${Math.round(h * .014)}px ${Math.round(w * .036)}px;border-radius:${Math.round(h * .025)}px;}
.hl{font-size:${hls}px;font-weight:900;line-height:1.05;color:#fff;letter-spacing:-.4px;}
.sub{font-size:${subs}px;line-height:1.45;color:rgba(255,255,255,.72);}
.cta{background:#fff;color:${pc};border:none;border-radius:${Math.max(Math.round(h * .03), 4)}px;
padding:${Math.round(h * .042)}px ${Math.round(w * .09)}px;font-size:${ctas}px;font-weight:700;
cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.3);margin-top:${Math.round(gap * .5)}px;}
</style></head><body><div class="glow"></div>
<div class="wrap">${tag ? `<div class="badge">${tag}</div>` : ''}<div class="hl">${hl}</div>
<div class="sub">${sub}</div><button class="cta">${cta}</button></div></body></html>`;
    }
  },

  /* ──────────────────────────────────────────────
     2. NEON DARK
  ────────────────────────────────────────────── */
  {
    id: 'neon-dark',
    name: 'Neon Dark',
    desc: 'Tech e futurista',
    render: function (p) {
      var w = p.width || 336, h = p.height || 280;
      var pc = p.primaryColor || '#00e5ff';
      var sc = p.secondaryColor || '#ff00cc';
      var hl = p.headline || 'Headline Principal';
      var sub = p.subtitle || 'Subtítulo aqui';
      var cta = p.cta || 'Explorar';
      var tag = p.tag || '';
      var wide = w / h > 2.2;

      if (wide) {
        var hls = Math.max(Math.round(h * .32), 13);
        var subs = Math.max(Math.round(h * .19), 10);
        var ctas = Math.max(Math.round(h * .21), 10);
        return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
*{margin:0;padding:0;box-sizing:border-box}html,body{width:${w}px;height:${h}px;overflow:hidden}
body{background:#000;font-family:system-ui,-apple-system,Arial,sans-serif;
display:flex;align-items:center;justify-content:space-between;
padding:0 ${Math.round(w * .03)}px;border:1px solid ${pc}33;}
.texts{display:flex;flex-direction:column;gap:${Math.round(h * .05)}px;}
.hl{font-size:${hls}px;font-weight:900;color:${pc};
text-shadow:0 0 ${Math.round(hls * .5)}px ${pc}88;letter-spacing:-.2px;}
.sub{font-size:${subs}px;color:rgba(255,255,255,.55);}
.cta{background:transparent;color:${pc};border:1px solid ${pc};
border-radius:${Math.max(Math.round(h * .12), 4)}px;
padding:${Math.round(h * .12)}px ${Math.round(w * .025)}px;
font-size:${ctas}px;font-weight:700;white-space:nowrap;cursor:pointer;
box-shadow:0 0 ${Math.round(h * .15)}px ${pc}55,inset 0 0 ${Math.round(h * .15)}px ${pc}22;
text-shadow:0 0 8px ${pc};}
</style></head><body>
<div class="texts"><div class="hl">${hl}</div><div class="sub">${sub}</div></div>
<button class="cta">${cta}</button></body></html>`;
      }

      var hls = Math.max(Math.round(h * .13), 14);
      var subs = Math.max(Math.round(h * .052), 11);
      var ctas = Math.max(Math.round(h * .052), 11);
      var gap = Math.max(Math.round(h * .03), 6);
      var pad = Math.round(h * .07);
      var grid = Math.round(w / 8);
      var gridh = Math.round(h / 6);
      return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
*{margin:0;padding:0;box-sizing:border-box}html,body{width:${w}px;height:${h}px;overflow:hidden;position:relative}
body{background:#060610;font-family:system-ui,-apple-system,Arial,sans-serif;
display:flex;align-items:center;justify-content:center;}
.grid{position:absolute;inset:0;
background-image:linear-gradient(${pc}12 1px,transparent 1px),linear-gradient(90deg,${pc}12 1px,transparent 1px);
background-size:${grid}px ${gridh}px;animation:gr 20s linear infinite;}
@keyframes gr{0%{background-position:0 0}100%{background-position:${grid}px ${gridh}px}}
.scan{position:absolute;width:100%;height:2px;
background:linear-gradient(90deg,transparent,${pc}99,transparent);
animation:sc 2s linear infinite;top:0;}
@keyframes sc{0%{top:0}100%{top:${h}px}}
.wrap{position:relative;z-index:1;display:flex;flex-direction:column;
align-items:center;text-align:center;padding:${pad}px;gap:${gap}px;}
.badge{font-size:${Math.max(Math.round(h * .038), 9)}px;font-weight:600;letter-spacing:3px;
text-transform:uppercase;color:${sc};text-shadow:0 0 10px ${sc};}
.hl{font-size:${hls}px;font-weight:900;line-height:1.05;color:#fff;
text-shadow:0 0 ${Math.round(hls * .4)}px ${pc}bb,0 0 ${Math.round(hls * .8)}px ${pc}44;}
.sub{font-size:${subs}px;line-height:1.45;color:rgba(255,255,255,.55);}
.cta{background:transparent;color:${pc};border:1px solid ${pc};
border-radius:${Math.max(Math.round(h * .03), 4)}px;
padding:${Math.round(h * .042)}px ${Math.round(w * .09)}px;
font-size:${ctas}px;font-weight:700;cursor:pointer;
box-shadow:0 0 ${Math.round(hls * .5)}px ${pc}55,inset 0 0 ${Math.round(hls * .3)}px ${pc}22;
text-shadow:0 0 8px ${pc};margin-top:${Math.round(gap * .5)}px;}
</style></head><body><div class="grid"></div><div class="scan"></div>
<div class="wrap">${tag ? `<div class="badge">${tag}</div>` : ''}<div class="hl">${hl}</div>
<div class="sub">${sub}</div><button class="cta">${cta}</button></div></body></html>`;
    }
  },

  /* ──────────────────────────────────────────────
     3. CLEAN MINIMAL
  ────────────────────────────────────────────── */
  {
    id: 'clean-minimal',
    name: 'Clean Minimal',
    desc: 'Elegante e sofisticado',
    render: function (p) {
      var w = p.width || 336, h = p.height || 280;
      var pc = p.primaryColor || '#1d4ed8';
      var sc = p.secondaryColor || '#f59e0b';
      var hl = p.headline || 'Headline Principal';
      var sub = p.subtitle || 'Subtítulo aqui';
      var cta = p.cta || 'Saiba Mais';
      var tag = p.tag || '';
      var wide = w / h > 2.2;

      if (wide) {
        var hls = Math.max(Math.round(h * .30), 13);
        var subs = Math.max(Math.round(h * .18), 10);
        var ctas = Math.max(Math.round(h * .20), 10);
        var bw = Math.round(h * .12);
        return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
*{margin:0;padding:0;box-sizing:border-box}html,body{width:${w}px;height:${h}px;overflow:hidden}
body{background:#fff;font-family:system-ui,-apple-system,Arial,sans-serif;
display:flex;align-items:center;justify-content:space-between;
padding:0 ${Math.round(w * .03)}px;border-left:${bw}px solid ${pc};}
.texts{flex:1;display:flex;flex-direction:column;gap:${Math.round(h * .04)}px;
padding-left:${Math.round(w * .02)}px;}
.hl{font-size:${hls}px;font-weight:800;color:#111;letter-spacing:-.3px;line-height:1.1;}
.sub{font-size:${subs}px;color:#666;line-height:1.3;}
.cta{background:${pc};color:#fff;border:none;border-radius:${Math.max(Math.round(h * .10), 4)}px;
padding:${Math.round(h * .12)}px ${Math.round(w * .025)}px;font-size:${ctas}px;font-weight:700;
white-space:nowrap;cursor:pointer;flex-shrink:0;}
</style></head><body>
<div class="texts"><div class="hl">${hl}</div><div class="sub">${sub}</div></div>
<button class="cta">${cta}</button></body></html>`;
      }

      var hls = Math.max(Math.round(h * .12), 14);
      var subs = Math.max(Math.round(h * .050), 11);
      var ctas = Math.max(Math.round(h * .050), 11);
      var gap = Math.max(Math.round(h * .028), 5);
      var pad = Math.round(h * .08);
      var accentH = Math.max(Math.round(h * .025), 3);
      return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
*{margin:0;padding:0;box-sizing:border-box}html,body{width:${w}px;height:${h}px;overflow:hidden}
body{background:#fff;font-family:system-ui,-apple-system,Arial,sans-serif;
display:flex;flex-direction:column;align-items:center;justify-content:center;
padding:${pad}px;gap:${gap}px;text-align:center;position:relative;}
.accent{position:absolute;top:0;left:0;right:0;height:${accentH}px;
background:linear-gradient(90deg,${pc},${sc});}
.badge{font-size:${Math.max(Math.round(h * .036), 9)}px;font-weight:600;letter-spacing:2px;
text-transform:uppercase;color:${pc};}
.hl{font-size:${hls}px;font-weight:800;line-height:1.1;color:#111;letter-spacing:-.3px;}
.divider{width:${Math.round(w * .1)}px;height:2px;background:${sc};border-radius:2px;}
.sub{font-size:${subs}px;line-height:1.5;color:#555;}
.cta{background:${pc};color:#fff;border:none;border-radius:${Math.max(Math.round(h * .03), 4)}px;
padding:${Math.round(h * .04)}px ${Math.round(w * .09)}px;
font-size:${ctas}px;font-weight:700;cursor:pointer;margin-top:${Math.round(gap * .5)}px;}
</style></head><body><div class="accent"></div>
${tag ? `<div class="badge">${tag}</div>` : ''}
<div class="hl">${hl}</div><div class="divider"></div>
<div class="sub">${sub}</div><button class="cta">${cta}</button></body></html>`;
    }
  },

  /* ──────────────────────────────────────────────
     4. E-COMMERCE
  ────────────────────────────────────────────── */
  {
    id: 'ecommerce',
    name: 'E-commerce',
    desc: 'Produto com oferta',
    render: function (p) {
      var w = p.width || 336, h = p.height || 280;
      var pc = p.primaryColor || '#dc2626';
      var sc = p.secondaryColor || '#fbbf24';
      var hl = p.headline || 'Promoção Imperdível';
      var sub = p.subtitle || 'Frete grátis • Parcele sem juros';
      var cta = p.cta || 'Comprar Agora';
      var tag = p.tag || 'ATÉ 50% OFF';
      var wide = w / h > 2.2;

      if (wide) {
        var hls = Math.max(Math.round(h * .28), 13);
        var subs = Math.max(Math.round(h * .18), 10);
        var ctas = Math.max(Math.round(h * .20), 10);
        var bs = Math.max(Math.round(h * .22), 11);
        return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
*{margin:0;padding:0;box-sizing:border-box}html,body{width:${w}px;height:${h}px;overflow:hidden}
body{background:#fff;font-family:system-ui,-apple-system,Arial,sans-serif;
display:flex;align-items:center;justify-content:space-between;
padding:0 ${Math.round(w * .025)}px;border-top:${Math.round(h * .08)}px solid ${pc};}
.badge{background:${pc};color:#fff;font-size:${bs}px;font-weight:900;
padding:${Math.round(h * .10)}px ${Math.round(w * .02)}px;
border-radius:${Math.round(h * .06)}px;white-space:nowrap;flex-shrink:0;}
.texts{flex:1;padding:0 ${Math.round(w * .02)}px;display:flex;flex-direction:column;gap:${Math.round(h * .04)}px;}
.hl{font-size:${hls}px;font-weight:800;color:#111;line-height:1.1;}
.sub{font-size:${subs}px;color:#666;}
.cta{background:${pc};color:#fff;border:none;border-radius:${Math.round(h * .10)}px;
padding:${Math.round(h * .12)}px ${Math.round(w * .025)}px;font-size:${ctas}px;font-weight:700;
white-space:nowrap;cursor:pointer;flex-shrink:0;}
</style></head><body>
<div class="badge">${tag}</div>
<div class="texts"><div class="hl">${hl}</div><div class="sub">${sub}</div></div>
<button class="cta">${cta}</button></body></html>`;
      }

      var hls = Math.max(Math.round(h * .11), 14);
      var subs = Math.max(Math.round(h * .046), 10);
      var ctas = Math.max(Math.round(h * .05), 11);
      var bads = Math.max(Math.round(h * .11), 14);
      var gap = Math.max(Math.round(h * .025), 5);
      var pad = Math.round(h * .06);
      return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
*{margin:0;padding:0;box-sizing:border-box}html,body{width:${w}px;height:${h}px;overflow:hidden;position:relative}
body{background:linear-gradient(180deg,#fff 0%,#fff7f7 100%);
font-family:system-ui,-apple-system,Arial,sans-serif;display:flex;flex-direction:column;
align-items:center;justify-content:center;padding:${pad}px;gap:${gap}px;text-align:center;}
.wave{position:absolute;bottom:0;left:0;right:0;height:30%;background:${pc};
clip-path:ellipse(60% 100% at 50% 100%);}
.badge{position:relative;z-index:1;background:${pc};color:#fff;
font-size:${bads}px;font-weight:900;letter-spacing:.5px;
padding:${Math.round(h * .025)}px ${Math.round(w * .05)}px;
border-radius:${Math.round(h * .025)}px;
box-shadow:0 ${Math.round(h * .015)}px ${Math.round(h * .04)}px ${pc}66;
animation:pop .6s cubic-bezier(.34,1.56,.64,1) both;}
@keyframes pop{from{transform:scale(.8);opacity:0}to{transform:scale(1);opacity:1}}
.hl{position:relative;z-index:1;font-size:${hls}px;font-weight:800;line-height:1.1;color:#111;letter-spacing:-.3px;}
.sub{position:relative;z-index:1;font-size:${subs}px;color:#555;line-height:1.4;}
.cta{position:relative;z-index:1;background:#fff;color:${pc};border:2px solid ${pc};
border-radius:${Math.max(Math.round(h * .03), 4)}px;
padding:${Math.round(h * .04)}px ${Math.round(w * .08)}px;
font-size:${ctas}px;font-weight:800;cursor:pointer;
box-shadow:0 ${Math.round(h * .02)}px ${Math.round(h * .04)}px rgba(0,0,0,.15);}
</style></head><body><div class="wave"></div>
<div class="badge">${tag}</div>
<div class="hl">${hl}</div><div class="sub">${sub}</div>
<button class="cta">${cta}</button></body></html>`;
    }
  },

  /* ──────────────────────────────────────────────
     5. SPLIT COLOR
  ────────────────────────────────────────────── */
  {
    id: 'split-color',
    name: 'Split Color',
    desc: 'Divisão com contraste',
    render: function (p) {
      var w = p.width || 336, h = p.height || 280;
      var pc = p.primaryColor || '#0f172a';
      var sc = p.secondaryColor || '#f97316';
      var hl = p.headline || 'Headline Principal';
      var sub = p.subtitle || 'Subtítulo aqui';
      var cta = p.cta || 'Clique Aqui';
      var tag = p.tag || '';
      var wide = w / h > 2.2;

      if (wide) {
        var sw = Math.round(w * .38);
        var hls = Math.max(Math.round(h * .28), 13);
        var subs = Math.max(Math.round(h * .18), 10);
        var ctas = Math.max(Math.round(h * .20), 10);
        return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
*{margin:0;padding:0;box-sizing:border-box}html,body{width:${w}px;height:${h}px;overflow:hidden}
body{font-family:system-ui,-apple-system,Arial,sans-serif;display:flex;}
.left{width:${sw}px;height:${h}px;background:${pc};display:flex;align-items:center;
justify-content:center;padding:${Math.round(w * .02)}px;flex-shrink:0;}
.brand{font-size:${Math.max(Math.round(h * .30), 12)}px;font-weight:900;color:#fff;letter-spacing:-.5px;
text-align:center;line-height:1.1;}
.brand span{color:${sc};}
.right{flex:1;background:#fff;display:flex;flex-direction:column;align-items:flex-start;
justify-content:center;padding:${Math.round(w * .02)}px;gap:${Math.round(h * .04)}px;}
.hl{font-size:${hls}px;font-weight:800;color:#111;letter-spacing:-.3px;line-height:1.1;}
.sub{font-size:${subs}px;color:#666;}
.cta{background:${sc};color:#fff;border:none;border-radius:${Math.max(Math.round(h * .10), 4)}px;
padding:${Math.round(h * .12)}px ${Math.round(w * .025)}px;font-size:${ctas}px;font-weight:700;
cursor:pointer;white-space:nowrap;}
</style></head><body>
<div class="left"><div class="brand">Ads<span>Up</span></div></div>
<div class="right"><div class="hl">${hl}</div><div class="sub">${sub}</div>
<button class="cta">${cta}</button></div></body></html>`;
      }

      var lw = Math.round(w * .42);
      var hls = Math.max(Math.round(h * .12), 14);
      var subs = Math.max(Math.round(h * .048), 11);
      var ctas = Math.max(Math.round(h * .048), 11);
      var gap = Math.max(Math.round(h * .028), 5);
      var pad = Math.round(h * .07);
      return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
*{margin:0;padding:0;box-sizing:border-box}html,body{width:${w}px;height:${h}px;overflow:hidden}
body{font-family:system-ui,-apple-system,Arial,sans-serif;display:flex;}
.left{width:${lw}px;height:${h}px;background:${pc};display:flex;flex-direction:column;
align-items:center;justify-content:center;padding:${Math.round(lw * .1)}px;gap:${Math.round(h * .04)}px;
position:relative;flex-shrink:0;}
.left::after{content:'';position:absolute;right:-${Math.round(h * .06)}px;top:0;bottom:0;
width:${Math.round(h * .12)}px;background:${pc};
clip-path:polygon(0 0,0% 100%,100% 100%,100% 0);}
.logo{font-size:${Math.max(Math.round(h * .11), 13)}px;font-weight:900;color:#fff;
letter-spacing:-.3px;line-height:1;}
.logo span{color:${sc};}
.tagline{font-size:${Math.max(Math.round(h * .042), 9)}px;color:rgba(255,255,255,.6);
text-align:center;line-height:1.3;}
.accent{width:${Math.round(lw * .25)}px;height:3px;background:${sc};border-radius:2px;}
.right{flex:1;background:#f8fafc;display:flex;flex-direction:column;
justify-content:center;padding:${pad}px ${Math.round(h * .06)}px;gap:${gap}px;
padding-left:${Math.round(lw * .08 + h * .12)}px;}
.badge{font-size:${Math.max(Math.round(h * .036), 9)}px;font-weight:600;letter-spacing:1.5px;
text-transform:uppercase;color:${sc};}
.hl{font-size:${hls}px;font-weight:800;line-height:1.1;color:#111;letter-spacing:-.3px;}
.sub{font-size:${subs}px;line-height:1.5;color:#555;}
.cta{background:${sc};color:#fff;border:none;border-radius:${Math.max(Math.round(h * .03), 4)}px;
padding:${Math.round(h * .04)}px ${Math.round(w * .07)}px;font-size:${ctas}px;font-weight:700;
cursor:pointer;align-self:flex-start;}
</style></head><body>
<div class="left">
  <div class="logo">Ads<span>Up</span></div>
  <div class="accent"></div>
  <div class="tagline">AdForge</div>
</div>
<div class="right">
  ${tag ? `<div class="badge">${tag}</div>` : ''}
  <div class="hl">${hl}</div>
  <div class="sub">${sub}</div>
  <button class="cta">${cta}</button>
</div></body></html>`;
    }
  },

  /* ──────────────────────────────────────────────
     6. CORPORATE
  ────────────────────────────────────────────── */
  {
    id: 'corporate',
    name: 'Corporate',
    desc: 'Profissional e confiável',
    render: function (p) {
      var w = p.width || 336, h = p.height || 280;
      var pc = p.primaryColor || '#1e3a5f';
      var sc = p.secondaryColor || '#2563eb';
      var hl = p.headline || 'Headline Principal';
      var sub = p.subtitle || 'Subtítulo aqui';
      var cta = p.cta || 'Fale Conosco';
      var tag = p.tag || '';
      var wide = w / h > 2.2;

      if (wide) {
        var hls = Math.max(Math.round(h * .28), 13);
        var subs = Math.max(Math.round(h * .18), 10);
        var ctas = Math.max(Math.round(h * .20), 10);
        return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
*{margin:0;padding:0;box-sizing:border-box}html,body{width:${w}px;height:${h}px;overflow:hidden}
body{background:linear-gradient(90deg,${pc} 0%,#1a3258 100%);
font-family:system-ui,-apple-system,Arial,sans-serif;display:flex;align-items:center;
justify-content:space-between;padding:0 ${Math.round(w * .03)}px;
border-bottom:${Math.round(h * .06)}px solid ${sc};}
.left{display:flex;align-items:center;gap:${Math.round(w * .02)}px;}
.logo-box{width:${Math.round(h * .5)}px;height:${Math.round(h * .5)}px;background:${sc};
border-radius:${Math.round(h * .06)}px;display:flex;align-items:center;justify-content:center;
font-size:${Math.max(Math.round(h * .22), 10)}px;font-weight:900;color:#fff;flex-shrink:0;}
.texts{display:flex;flex-direction:column;gap:${Math.round(h * .04)}px;}
.hl{font-size:${hls}px;font-weight:800;color:#fff;letter-spacing:-.3px;line-height:1.1;}
.sub{font-size:${subs}px;color:rgba(255,255,255,.65);}
.cta{background:${sc};color:#fff;border:none;border-radius:${Math.max(Math.round(h * .1), 4)}px;
padding:${Math.round(h * .13)}px ${Math.round(w * .025)}px;
font-size:${ctas}px;font-weight:700;white-space:nowrap;cursor:pointer;flex-shrink:0;}
</style></head><body>
<div class="left"><div class="logo-box">A</div>
<div class="texts"><div class="hl">${hl}</div><div class="sub">${sub}</div></div></div>
<button class="cta">${cta}</button></body></html>`;
      }

      var hls = Math.max(Math.round(h * .12), 14);
      var subs = Math.max(Math.round(h * .048), 11);
      var ctas = Math.max(Math.round(h * .048), 11);
      var gap = Math.max(Math.round(h * .028), 5);
      var headerH = Math.round(h * .25);
      var pad = Math.round(h * .07);
      return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
*{margin:0;padding:0;box-sizing:border-box}html,body{width:${w}px;height:${h}px;overflow:hidden}
body{background:#f1f5f9;font-family:system-ui,-apple-system,Arial,sans-serif;
display:flex;flex-direction:column;}
.header{height:${headerH}px;background:linear-gradient(135deg,${pc},${sc});
display:flex;align-items:center;padding:0 ${pad}px;gap:${Math.round(w * .025)}px;
position:relative;overflow:hidden;}
.header::after{content:'';position:absolute;right:-${Math.round(h * .1)}px;top:-${Math.round(h * .1)}px;
width:${Math.round(h * .4)}px;height:${Math.round(h * .4)}px;border-radius:50%;
background:rgba(255,255,255,.06);}
.logo-box{width:${Math.round(headerH * .55)}px;height:${Math.round(headerH * .55)}px;
background:rgba(255,255,255,.15);border-radius:${Math.round(headerH * .12)}px;
display:flex;align-items:center;justify-content:center;
font-size:${Math.max(Math.round(headerH * .28), 11)}px;font-weight:900;color:#fff;flex-shrink:0;}
.logo-text{font-size:${Math.max(Math.round(headerH * .22), 11)}px;font-weight:700;color:#fff;}
.logo-text span{opacity:.7;font-weight:400;display:block;
font-size:${Math.max(Math.round(headerH * .14), 9)}px;letter-spacing:.5px;}
.body{flex:1;display:flex;flex-direction:column;justify-content:center;
padding:${pad}px;gap:${gap}px;}
.badge{font-size:${Math.max(Math.round(h * .036), 9)}px;font-weight:600;letter-spacing:1.5px;
text-transform:uppercase;color:${sc};}
.hl{font-size:${hls}px;font-weight:800;line-height:1.1;color:#0f172a;letter-spacing:-.3px;}
.sub{font-size:${subs}px;line-height:1.5;color:#475569;}
.cta{background:${sc};color:#fff;border:none;border-radius:${Math.max(Math.round(h * .025), 4)}px;
padding:${Math.round(h * .038)}px ${Math.round(w * .08)}px;
font-size:${ctas}px;font-weight:700;cursor:pointer;align-self:flex-start;
margin-top:${Math.round(gap * .3)}px;}
</style></head><body>
<div class="header">
  <div class="logo-box">A</div>
  <div class="logo-text">AdsUp<span>AdForge</span></div>
</div>
<div class="body">
  ${tag ? `<div class="badge">${tag}</div>` : ''}
  <div class="hl">${hl}</div>
  <div class="sub">${sub}</div>
  <button class="cta">${cta}</button>
</div></body></html>`;
    }
  }

];
