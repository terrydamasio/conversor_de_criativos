'use strict';

var GIF_JS_CDN     = 'https://cdn.jsdelivr.net/gh/jnordberg/gif.js@0.2.0/dist/gif.js';
var GIF_WORKER_CDN = 'https://cdn.jsdelivr.net/gh/jnordberg/gif.js@0.2.0/dist/gif.worker.js';

function loadGifJS() {
  if (typeof GIF !== 'undefined') return Promise.resolve();
  return new Promise(function(resolve, reject) {
    var s = document.createElement('script');
    s.src = GIF_JS_CDN;
    s.onload = resolve;
    s.onerror = function() { reject(new Error('Falha ao carregar gif.js do CDN. Verifique sua conexão.')); };
    document.head.appendChild(s);
  });
}

function loadGifWorkerBlob() {
  return fetch(GIF_WORKER_CDN)
    .then(function(r) {
      if (!r.ok) throw new Error('Falha ao baixar gif.worker.js (HTTP ' + r.status + ')');
      return r.blob();
    })
    .then(function(blob) { return URL.createObjectURL(blob); });
}

function dataURLToCanvas(dataURL, w, h) {
  return new Promise(function(resolve, reject) {
    var img = new Image();
    img.onload = function() {
      var c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      c.getContext('2d').drawImage(img, 0, 0, w, h);
      resolve(c);
    };
    img.onerror = function() { reject(new Error('Falha ao decodificar frame de captura')); };
    img.src = dataURL;
  });
}

/**
 * Renders an HTML creative as an animated GIF.
 * Depends on renderHTML() defined globally in app.js.
 *
 * Each frame is captured with a fresh iframe, using waitMs = frameIndex * frameDelay
 * so CSS animations are sampled at the right time offset.
 *
 * @param {string} htmlContent
 * @param {number} width  - CSS pixels
 * @param {number} height - CSS pixels
 * @param {object} opts
 *   fps        {number}   - frames per second (default 10)
 *   duration   {number}   - total animation in ms (default 2000)
 *   scale      {number}   - render scale 1|2 (default 1)
 *   quality    {number}   - gif quality 1-30, lower = better (default 10)
 *   onProgress {function(frame, total)}
 * @returns {Promise<Blob>}
 */
function htmlToGIF(htmlContent, width, height, opts) {
  opts = opts || {};
  var fps       = opts.fps      || 10;
  var duration  = opts.duration || 2000;
  var scale     = opts.scale    || 1;
  var quality   = opts.quality  || 10;
  var onProg    = opts.onProgress || null;

  var frameCount = Math.max(2, Math.round(fps * duration / 1000));
  var frameDelay = Math.round(1000 / fps);
  var workerURL  = null;

  return loadGifJS()
    .then(function() { return loadGifWorkerBlob(); })
    .then(function(wUrl) {
      workerURL = wUrl;

      var indices = [];
      for (var i = 0; i < frameCount; i++) indices.push(i);

      return indices.reduce(function(chain, idx) {
        return chain.then(function(canvases) {
          if (onProg) onProg(idx, frameCount);
          var waitMs = idx * frameDelay;
          return renderHTML(htmlContent, width, height, scale, waitMs)
            .then(function(dataURL) {
              return dataURLToCanvas(dataURL, width * scale, height * scale);
            })
            .then(function(c) {
              canvases.push(c);
              return canvases;
            });
        });
      }, Promise.resolve([]));
    })
    .then(function(canvases) {
      return new Promise(function(resolve, reject) {
        var gif = new GIF({
          workers: 2,
          quality: quality,
          width: width * scale,
          height: height * scale,
          workerScript: workerURL,
          repeat: 0
        });

        canvases.forEach(function(c) {
          gif.addFrame(c, { delay: frameDelay, copy: true });
        });

        gif.on('finished', function(blob) {
          URL.revokeObjectURL(workerURL);
          resolve(blob);
        });

        gif.on('error', function(err) {
          URL.revokeObjectURL(workerURL);
          reject(new Error('Erro ao codificar GIF: ' + (err && err.message || String(err))));
        });

        gif.render();
      });
    })
    .catch(function(err) {
      if (workerURL) { URL.revokeObjectURL(workerURL); workerURL = null; }
      throw err;
    });
}
