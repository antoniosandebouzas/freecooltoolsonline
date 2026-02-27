(function () {
  var EXPONENT = 4.0; // iOS-style superellipse

  function generateSquirclePathData(width, height, exponent) {
    if (width <= 0 || height <= 0) return '';
    var shortestSide = Math.min(width, height);
    var cornerRadius = shortestSide / 2;
    var deltaX = (width - shortestSide) / 2;
    var deltaY = (height - shortestSide) / 2;
    var centerX = width / 2;
    var centerY = height / 2;
    var n = 30;
    var pts = [];
    for (var i = 0; i <= n; i++) {
      var t = (i / n) * (Math.PI / 2);
      pts.push({
        x: cornerRadius * Math.pow(Math.cos(t), 2 / exponent),
        y: cornerRadius * Math.pow(Math.sin(t), 2 / exponent)
      });
    }
    var d = 'M ' + (centerX + pts[0].x + deltaX) + ' ' + (centerY + pts[0].y + deltaY);
    for (var i = 0; i <= n; i++) d += ' L ' + (centerX + pts[i].x + deltaX) + ' ' + (centerY + pts[i].y + deltaY);
    for (var i = n; i >= 0; i--) d += ' L ' + (centerX - pts[i].x - deltaX) + ' ' + (centerY + pts[i].y + deltaY);
    for (var i = 0; i <= n; i++) d += ' L ' + (centerX - pts[i].x - deltaX) + ' ' + (centerY - pts[i].y - deltaY);
    for (var i = n; i >= 0; i--) d += ' L ' + (centerX + pts[i].x + deltaX) + ' ' + (centerY - pts[i].y - deltaY);
    return d + ' Z';
  }

  // Four-directional 0-blur drop-shadows give a crisp 1px outline.
  // drop-shadow renders AFTER clip-path, so it correctly traces the squircle outline
  // instead of the underlying rectangular border box.
  function makeShadow(color) {
    return 'drop-shadow(1px 0 0 ' + color + ') '
         + 'drop-shadow(-1px 0 0 ' + color + ') '
         + 'drop-shadow(0 1px 0 ' + color + ') '
         + 'drop-shadow(0 -1px 0 ' + color + ')';
  }

  // Excluded: <select> (clips native dropdown arrow)
  //           .card (has JS-less hover interaction we'd lose)
  //           .output-panel / .controls-panel (overflow containers)
  var SELECTORS = [
    '.btn',
    '.text-input',
    '.textarea-input',
    '.result-card'
  ].join(', ');

  // WeakSet tracks which elements already have focus/blur listeners
  var listenerSet = new WeakSet();

  function applySquircle(el, defaultShadow, focusShadow) {
    var rect = el.getBoundingClientRect();
    var w = Math.round(rect.width);
    var h = Math.round(rect.height);
    if (w <= 0 || h <= 0) return;

    el.style.clipPath    = 'path("' + generateSquirclePathData(w, h, EXPONENT) + '")';
    el.style.borderRadius = '0';

    // CSS borders are rectangular — they get cut off diagonally at the squircle
    // edge rather than following the curve. Replace with filter: drop-shadow(),
    // which renders AFTER clip-path and correctly traces the squircle outline.
    el.style.border = 'none';
    el.style.filter = el === document.activeElement ? focusShadow : defaultShadow;

    // Attach focus/blur listeners once to swap the shadow color
    // (replaces the now-removed CSS border-color focus rule)
    if (!listenerSet.has(el)) {
      listenerSet.add(el);
      el.addEventListener('focus', function () { this.style.filter = focusShadow; });
      el.addEventListener('blur',  function () { this.style.filter = defaultShadow; });
    }
  }

  function applyAll() {
    var cs          = getComputedStyle(document.documentElement);
    var borderColor = cs.getPropertyValue('--color-border').trim()       || '#E0E0E0';
    var focusColor  = cs.getPropertyValue('--color-border-focus').trim() || '#1a73e8';
    var defShadow   = makeShadow(borderColor);
    var focShadow   = makeShadow(focusColor);

    document.querySelectorAll(SELECTORS).forEach(function (el) {
      applySquircle(el, defShadow, focShadow);
    });
  }

  // rAF after DOMContentLoaded ensures layout is complete before measuring
  document.addEventListener('DOMContentLoaded', function () {
    requestAnimationFrame(applyAll);
  });

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(applyAll, 100);
  });

  // Re-read border color token when dark/light mode toggles
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      requestAnimationFrame(applyAll);
    });
  }

  // Public API for dynamic content (e.g. after Plotly renders or content injected)
  window.applyUISquircles = applyAll;
})();
