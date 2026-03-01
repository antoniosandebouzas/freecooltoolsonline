// ─── Shared utilities for all tool pages ─────────────────────────────────────
// Included once via custom-head.html; each page's <script> uses these globals.

// ── Copy to clipboard ────────────────────────────────────────────────────────
// Pages set window._toolOutput = text whenever they produce output.
function copyOutput() {
  var text = window._toolOutput;
  if (!text) return;
  var fb = document.getElementById('copyFeedback');
  function show() {
    fb.classList.add('copy-feedback--visible');
    setTimeout(function () { fb.classList.remove('copy-feedback--visible'); }, 1500);
  }
  if (navigator.clipboard) { navigator.clipboard.writeText(text).then(show); }
  else {
    var t = document.createElement('textarea');
    t.value = text;
    t.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(t);
    t.select();
    document.execCommand('copy');
    document.body.removeChild(t);
    show();
  }
}

// ── Download output as file ──────────────────────────────────────────────────
function downloadOutput(ext) {
  var text = window._toolOutput;
  if (!text) return;
  var blob = new Blob([text], { type: 'text/plain' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'output.' + (ext || 'txt');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}

// ── Custom-select toggle (money calculators) ─────────────────────────────────
function toggleCustom(id) {
  var sel = document.getElementById(id);
  var inp = document.getElementById(id + 'Custom');
  if (inp) inp.style.display = sel.value === 'custom' ? 'block' : 'none';
  if (inp && sel.value === 'custom') inp.focus();
}

// ── Value reader for select-with-custom-input ────────────────────────────────
function val(id) {
  var sel = document.getElementById(id);
  if (sel.value === 'custom') {
    var v = parseFloat(document.getElementById(id + 'Custom').value);
    return isNaN(v) ? null : v;
  }
  return parseFloat(sel.value);
}

// ── Format USD currency ──────────────────────────────────────────────────────
function formatCurrency(value) {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// ── Hex to RGBA (Plotly fill colors — CSS vars return hex, not rgb()) ─────────
function hexToRgba(hex, alpha) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  var r = parseInt(hex.slice(0, 2), 16);
  var g = parseInt(hex.slice(2, 4), 16);
  var b = parseInt(hex.slice(4, 6), 16);
  return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
}

// ── Chart typography tokens ──────────────────────────────────────────────────
var CHART_FONT      = "-apple-system, BlinkMacSystemFont, 'Google Sans', sans-serif";
var CHART_FONT_MONO = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, 'Google Sans Code', Consolas, monospace";

// ── Chart color palette from CSS custom properties ───────────────────────────
function getChartColors() {
  var s = getComputedStyle(document.documentElement);
  return {
    blue:    s.getPropertyValue('--color-blue').trim()           || '#1a73e8',
    green:   s.getPropertyValue('--color-green').trim()          || '#1e8e3e',
    red:     s.getPropertyValue('--color-red').trim()            || '#d93025',
    neutral: s.getPropertyValue('--color-text-secondary').trim() || '#757575',
    bg:      s.getPropertyValue('--color-bg-page').trim()        || '#F5F5F5'
  };
}
