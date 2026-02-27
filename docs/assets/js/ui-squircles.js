(function () {
  var EXPONENT = 4.0; // superellipse — softer than iOS (4.0), rounder than circular (2.0)

  // Generates an SVG path for a squircle rounded rectangle.
  // Uses a center-based approach: cornerRadius = shortestSide/2, with deltaX/deltaY offsets
  // to extend the superellipse naturally into rectangular shapes.
  function generatePath(width, height) {
    if (width <= 0 || height <= 0) return '';

    var s  = Math.min(width, height); // shortest side
    var r  = s / 2;                   // corner radius = half of shortest side
    var dX = (width  - s) / 2;        // horizontal stretch offset
    var dY = (height - s) / 2;        // vertical stretch offset
    var cx = width  / 2;
    var cy = height / 2;
    var n  = 30; // points per quarter arc

    // Quarter-arc points in first quadrant (bottom-right)
    var pts = [];
    for (var i = 0; i <= n; i++) {
      var t = (i / n) * (Math.PI / 2);
      pts.push({
        x: r * Math.pow(Math.cos(t), 2 / EXPONENT),
        y: r * Math.pow(Math.sin(t), 2 / EXPONENT)
      });
    }

    // Start at rightmost point (theta=0: x=r, y=0), go clockwise
    var d = 'M ' + (cx + pts[0].x + dX).toFixed(2) + ' ' + (cy + pts[0].y + dY).toFixed(2);
    // Q1: bottom-right (forward: theta 0→π/2)
    for (var i = 0; i <= n; i++) d += ' L ' + (cx + pts[i].x + dX).toFixed(2) + ' ' + (cy + pts[i].y + dY).toFixed(2);
    // Q2: bottom-left (backward: theta π/2→0, negate x)
    for (var i = n; i >= 0; i--) d += ' L ' + (cx - pts[i].x - dX).toFixed(2) + ' ' + (cy + pts[i].y + dY).toFixed(2);
    // Q3: top-left (forward: theta 0→π/2, negate both)
    for (var i = 0; i <= n; i++) d += ' L ' + (cx - pts[i].x - dX).toFixed(2) + ' ' + (cy - pts[i].y - dY).toFixed(2);
    // Q4: top-right (backward: theta π/2→0, negate y)
    for (var i = n; i >= 0; i--) d += ' L ' + (cx + pts[i].x + dX).toFixed(2) + ' ' + (cy - pts[i].y - dY).toFixed(2);

    return d + ' Z';
  }

  // Exclude: <select> (native dropdown arrow clips), containers with overflow content
  var SELECTORS = [
    '.btn',
    '.text-input',
    '.textarea-input',
    '.result-card',
    '.output-panel'
  ].join(', ');

  function isColoredBtn(el) {
    return el.classList.contains('btn--primary')
        || el.classList.contains('btn--success')
        || el.classList.contains('btn--danger');
  }

  // Single drop-shadow traces the squircle outline cleanly.
  // drop-shadow renders AFTER clip-path, so it follows the squircle curve.
  function makeShadow(color) {
    return 'drop-shadow(0 0 1px ' + color + ')';
  }

  var listenerSet = new WeakSet();

  function applySquircle(el, defaultShadow, focusShadow) {
    // Remove border BEFORE measuring: auto-width elements (buttons, cards) shrink when their
    // border is removed. Measuring first then removing produces a path wider than the element,
    // which gets clipped as a straight 90° edge at the right and bottom.
    el.style.border       = 'none';
    el.style.borderRadius = '0';

    var rect = el.getBoundingClientRect();
    var w = Math.round(rect.width);
    var h = Math.round(rect.height);
    if (w <= 0 || h <= 0) return;

    el.style.clipPath = 'path("' + generatePath(w, h) + '")';


    // Colored buttons are visually defined by their background — skip gray outline.
    var colored = isColoredBtn(el);
    el.style.filter = colored ? 'none' : (el === document.activeElement ? focusShadow : defaultShadow);

    if (!listenerSet.has(el)) {
      listenerSet.add(el);
      el.addEventListener('focus', function () {
        this.style.filter = isColoredBtn(this) ? 'none' : focusShadow;
      });
      el.addEventListener('blur', function () {
        this.style.filter = isColoredBtn(this) ? 'none' : defaultShadow;
      });
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

  document.addEventListener('DOMContentLoaded', function () {
    requestAnimationFrame(applyAll);
  });

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(applyAll, 100);
  });

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      requestAnimationFrame(applyAll);
    });
  }

  window.applyUISquircles = applyAll;
})();
