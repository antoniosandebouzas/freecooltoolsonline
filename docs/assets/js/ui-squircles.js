(function () {
  var EXPONENT    = 4.0; // superellipse — softer than iOS (4.0), rounder than circular (2.0)
  var CORNER_MAX  = 64;  // max corner radius — keeps buttons looking like rounded rects, not pills

  // Generates an SVG path for a squircle rounded rectangle.
  // Corner arcs are superellipses capped at CORNER_MAX; straight edges connect them.
  function generatePath(width, height) {
    if (width <= 0 || height <= 0) return '';

    var r = Math.min(CORNER_MAX, Math.min(width, height) / 2);
    var n = 20; // points per quarter arc

    // Quarter-arc points relative to the corner center, first quadrant (cos→0, sin→r)
    var arc = [];
    for (var i = 0; i <= n; i++) {
      var t = (i / n) * (Math.PI / 2);
      arc.push({
        x: r * Math.pow(Math.cos(t), 2 / EXPONENT),
        y: r * Math.pow(Math.sin(t), 2 / EXPONENT)
      });
    }

    // Corner centers
    var x1 = r,         x2 = width - r;
    var y1 = r,         y2 = height - r;

    var d = '';
    function pt(x, y) {
      d += (d === '' ? 'M ' : ' L ') + x.toFixed(2) + ' ' + y.toFixed(2);
    }

    // Clockwise from top of top-right corner.
    // Each corner uses the SAME arc index for both x and y (same theta = true superellipse).
    // arc[n] = (0, r) = tangent start; arc[0] = (r, 0) = tangent end.
    // Top-right: (x2, y1-r) → (x2+r, y1)
    for (var i = 0; i <= n; i++) pt(x2 + arc[n - i].x, y1 - arc[n - i].y);
    // Bottom-right: (x2+r, y2) → (x2, y2+r)
    for (var i = 0; i <= n; i++) pt(x2 + arc[i].x, y2 + arc[i].y);
    // Bottom-left: (x1, y2+r) → (x1-r, y2)
    for (var i = 0; i <= n; i++) pt(x1 - arc[n - i].x, y2 + arc[n - i].y);
    // Top-left: (x1-r, y1) → (x1, y1-r)
    for (var i = 0; i <= n; i++) pt(x1 - arc[i].x, y1 - arc[i].y);

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
