(function () {
  var EXPONENT = 4.0; // superellipse — softer than iOS (4.0), rounder than circular (2.0)

  // Generates an SVG path for a squircle rounded rectangle.
  // Uses a center-based approach: cornerRadius = shortestSide/2, with deltaX/deltaY offsets
  // to extend the superellipse naturally into rectangular shapes.
  function generatePath(width, height) {
    if (width <= 0 || height <= 0) return '';

    var s  = Math.min(width, height); // shortest side
    var r  = Math.min(s / 2, 64);     // corner radius, capped at 128/2 = 64px
    var dX = width  / 2 - r;          // horizontal straight-line extension
    var dY = height / 2 - r;          // vertical straight-line extension
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

  var SELECTORS = [
    '.btn',
    '.text-input',
    '.textarea-input',
    '.result-card',
    '.output-panel',
    'select'
  ].join(', ');

  function isColoredBtn(el) {
    return el.classList.contains('btn--primary')
        || el.classList.contains('btn--success')
        || el.classList.contains('btn--danger');
  }

  // drop-shadow renders AFTER clip-path, so it follows the squircle curve.
  function makeShadow(color) {
    return 'drop-shadow(0 0 1px ' + color + ')';
  }

  var listenerSet = new WeakSet();
  var sizeMap     = new WeakMap(); // tracks last applied w×h per element

  function applySquircle(el, defaultShadow, focusShadow) {
    // Remove border BEFORE measuring: auto-width elements shrink when border is removed.
    el.style.border       = 'none';
    el.style.borderRadius = '0';

    var rect = el.getBoundingClientRect();
    var w = Math.round(rect.width);
    var h = Math.round(rect.height);
    if (w <= 0 || h <= 0) return;

    // Skip re-generating the path if size hasn't changed
    var prev = sizeMap.get(el);
    if (!prev || prev.w !== w || prev.h !== h) {
      el.style.clipPath = 'path("' + generatePath(w, h) + '")';
      sizeMap.set(el, { w: w, h: h });
    }

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

  // ── Cached shadow values (recomputed on theme change) ──────────────────────
  var defShadow, focShadow;

  function refreshShadows() {
    var cs     = getComputedStyle(document.documentElement);
    var border = cs.getPropertyValue('--color-border').trim()       || '#E0E0E0';
    var focus  = cs.getPropertyValue('--color-border-focus').trim() || '#1a73e8';
    defShadow  = makeShadow(border);
    focShadow  = makeShadow(focus);
  }

  function applyAll() {
    refreshShadows();
    document.querySelectorAll(SELECTORS).forEach(function (el) {
      applySquircle(el, defShadow, focShadow);
    });
  }

  // Apply squircle to a single element (used by observers)
  function applySingle(el) {
    if (!el.matches || !el.matches(SELECTORS)) return;
    if (!defShadow) refreshShadows();
    applySquircle(el, defShadow, focShadow);
  }

  // ── Textarea auto-resize ───────────────────────────────────────────────────
  function autoResize(el) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
    // Re-apply squircle since height changed
    applySingle(el);
  }

  function setupTextareaAutoResize() {
    document.querySelectorAll('.textarea-input').forEach(function (el) {
      if (listenerSet.has(el) && el._autoResize) return;
      el._autoResize = true;
      el.addEventListener('input', function () { autoResize(this); });
      // Initial size
      autoResize(el);
    });
  }

  // ── ResizeObserver — re-apply squircle when any tracked element changes size
  var resizeObserver;
  var observedSet = new WeakSet();

  function observeElement(el) {
    if (!resizeObserver || observedSet.has(el)) return;
    observedSet.add(el);
    resizeObserver.observe(el);
  }

  function initResizeObserver() {
    if (typeof ResizeObserver === 'undefined') return;
    resizeObserver = new ResizeObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        applySingle(entries[i].target);
      }
    });
  }

  // ── MutationObserver — detect newly visible / added elements ───────────────
  function initMutationObserver() {
    if (typeof MutationObserver === 'undefined') return;
    var mutTimer;
    new MutationObserver(function () {
      clearTimeout(mutTimer);
      mutTimer = setTimeout(function () {
        document.querySelectorAll(SELECTORS).forEach(function (el) {
          applySingle(el);
          observeElement(el);
        });
        setupTextareaAutoResize();
      }, 50);
    }).observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  }

  // ── Init ────────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    initResizeObserver();
    requestAnimationFrame(function () {
      applyAll();
      setupTextareaAutoResize();
      // Start observing all matched elements for resize
      document.querySelectorAll(SELECTORS).forEach(observeElement);
      initMutationObserver();
    });
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
