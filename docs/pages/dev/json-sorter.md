---
layout: page
title: JSON Sorter
permalink: /dev/json-sorter/
---

Sort all object keys alphabetically at every level of nesting.

<div class="tool-layout">
  <div class="input-wrapper">
    <label class="input-label" for="jsonInput">Paste JSON</label>
    <textarea class="textarea-input" id="jsonInput" placeholder='{"zebra":1,"apple":2,"mango":{"b":3,"a":4}}'></textarea>
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
    <button class="btn btn--primary" onclick="sortJson()">Sort Keys</button>
  </div>

  <div class="output-block">
    <div class="output-block-header">
      <span class="input-label">Sorted JSON</span>
      <span>
        <span class="copy-feedback" id="copyFeedback">Copied!</span>
        <button class="btn btn--small" onclick="copyOutput()">Copy</button>
      </span>
    </div>
    <div class="output-panel output-panel--empty" id="output">Sorted JSON will appear here.</div>
  </div>
</div>

<script>
  var outputEl = document.getElementById('output');

  function sortKeys(obj) {
    if (Array.isArray(obj)) return obj.map(sortKeys);
    if (obj !== null && typeof obj === 'object') {
      var out = {};
      Object.keys(obj).sort().forEach(function(k) { out[k] = sortKeys(obj[k]); });
      return out;
    }
    return obj;
  }

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

  function sortJson() {
    var input = document.getElementById('jsonInput').value.trim();
    if (!input) return;
    try   { showResult(JSON.stringify(sortKeys(JSON.parse(input)), null, getIndent())); }
    catch (e) { showError(e.message); }
  }
</script>
