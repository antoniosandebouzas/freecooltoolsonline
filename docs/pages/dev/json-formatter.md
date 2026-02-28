---
layout: page
title: JSON Formatter
permalink: /dev/json-formatter/
---

Paste any JSON to prettify and validate it.

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
  </div>

  <div class="output-block">
    <div class="output-block-header">
      <span class="input-label">Result</span>
      <span>
        <span class="copy-feedback" id="copyFeedback">Copied!</span>
        <button class="btn btn--small" onclick="copyOutput()">Copy</button>
      </span>
    </div>
    <div class="output-panel output-panel--empty" id="output">Formatted JSON will appear here.</div>
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
</script>
