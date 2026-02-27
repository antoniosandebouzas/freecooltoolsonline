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

  // Exclude <select> (clips native dropdown arrow) and containers with overflow content
  var SELECTORS = [
    '.btn',
    '.text-input',
    '.textarea-input',
    '.result-card',
    '.card'
  ].join(', ');

  function applySquircle(el) {
    var rect = el.getBoundingClientRect();
    var w = Math.round(rect.width);
    var h = Math.round(rect.height);
    if (w <= 0 || h <= 0) return;
    el.style.clipPath = 'path("' + generateSquirclePathData(w, h, EXPONENT) + '")';
    el.style.borderRadius = '0';
  }

  function applyAll() {
    document.querySelectorAll(SELECTORS).forEach(applySquircle);
  }

  // requestAnimationFrame ensures layout is complete before measuring dimensions
  document.addEventListener('DOMContentLoaded', function () {
    requestAnimationFrame(applyAll);
  });

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(applyAll, 100);
  });

  // Expose for dynamic re-application (e.g. after charts render new elements)
  window.applyUISquircles = applyAll;
})();
