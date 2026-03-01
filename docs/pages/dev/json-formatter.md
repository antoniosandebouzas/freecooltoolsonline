---
layout: page
title: JSON Tools
permalink: /dev/json-tools/
---

Format, minify, sort keys, stringify, or destringify JSON.

<div class="tool-layout">
  <div class="input-wrapper">
    <label class="input-label" for="jsonInput">Paste JSON</label>
    <textarea class="textarea-input" id="jsonInput" placeholder='{"name":"Alice","age":30,"tags":["admin","user"]}'></textarea>
  </div>

  <div class="input-group">
    <div class="input-wrapper">
      <label class="input-label" for="indentSize">Indent</label>
      <select id="indentSize">
        <option value="2" selected>2 spaces</option>
        <option value="4">4 spaces</option>
        <option value="tab">tab</option>
      </select>
    </div>
  </div>

  <div class="tool-actions">
    <button class="btn btn--primary" onclick="formatJson()">Format</button>
    <button class="btn" onclick="minifyJson()">Minify</button>
    <button class="btn" onclick="sortJson()">Sort Keys</button>
    <button class="btn" onclick="stringify()">Stringify</button>
    <button class="btn" onclick="destringify()">Destringify</button>
  </div>

  <div class="output-block">
    <div class="output-block-header">
      <span class="input-label">Result</span>
      <span>
        <span class="copy-feedback" id="copyFeedback">Copied!</span>
        <button class="btn btn--small" onclick="copyOutput()">Copy</button>
        <button class="btn btn--small" onclick="downloadOutput('json')">Download</button>
      </span>
    </div>
    <div class="output-panel output-panel--empty" id="output">Result will appear here.</div>
  </div>
</div>

<script>
  var outputEl = document.getElementById('output');

  function getIndent() {
    var v = document.getElementById('indentSize').value;
    return v === 'tab' ? '\t' : parseInt(v);
  }

  function showResult(text) {
    window._toolOutput = text;
    outputEl.textContent = text;
    outputEl.className   = 'output-panel';
  }

  function showError(msg) {
    window._toolOutput = '';
    outputEl.textContent = 'Error: ' + msg;
    outputEl.className   = 'output-panel output-panel--error';
  }

  function formatJson() {
    var input = document.getElementById('jsonInput').value.trim();
    if (!input) return;
    try   { showResult(JSON.stringify(JSON.parse(input), null, getIndent())); }
    catch (e) { showError(e.message); }
  }

  function minifyJson() {
    var input = document.getElementById('jsonInput').value.trim();
    if (!input) return;
    try   { showResult(JSON.stringify(JSON.parse(input))); }
    catch (e) { showError(e.message); }
  }

  function sortKeys(obj) {
    if (Array.isArray(obj)) return obj.map(sortKeys);
    if (obj !== null && typeof obj === 'object') {
      var out = {};
      Object.keys(obj).sort().forEach(function(k) { out[k] = sortKeys(obj[k]); });
      return out;
    }
    return obj;
  }

  function sortJson() {
    var input = document.getElementById('jsonInput').value.trim();
    if (!input) return;
    try   { showResult(JSON.stringify(sortKeys(JSON.parse(input)), null, getIndent())); }
    catch (e) { showError(e.message); }
  }

  function stringify() {
    var input = document.getElementById('jsonInput').value.trim();
    if (!input) return;
    try {
      JSON.parse(input);
      showResult(JSON.stringify(input));
    } catch (e) { showError(e.message); }
  }

  function destringify() {
    var input = document.getElementById('jsonInput').value.trim();
    if (!input) return;
    try {
      var unescaped = JSON.parse(input);
      if (typeof unescaped !== 'string') { showError('Input is not a JSON string'); return; }
      JSON.parse(unescaped);
      showResult(JSON.stringify(JSON.parse(unescaped), null, getIndent()));
    } catch (e) { showError(e.message); }
  }
</script>
