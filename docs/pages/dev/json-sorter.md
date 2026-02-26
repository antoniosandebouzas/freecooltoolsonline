---
layout: page
title: JSON Sorter
permalink: /dev/json-sorter/
---

Sort all object keys alphabetically at every level of nesting.

<div class="tool-layout">
  <div class="input-wrapper">
    <label class="input-label" for="jsonInput">Paste JSON</label>
    <textarea class="textarea-input" id="jsonInput" placeholder='{"zebra":1,"apple":2,"mango":{"b":3,"a":4}}' style="min-height:220px"></textarea>
  </div>

  <div class="input-group">
    <div class="input-wrapper">
      <label class="input-label" for="indentSize">Indent</label>
      <select class="text-input" id="indentSize" style="width:auto;min-width:130px">
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
  var outputEl   = document.getElementById('output');
  var outputText = '';

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
    outputText = text;
    outputEl.textContent = text;
    outputEl.className   = 'output-panel';
  }

  function showError(msg) {
    outputText = '';
    outputEl.textContent = 'Error: ' + msg;
    outputEl.className   = 'output-panel output-panel--error';
  }

  function sortJson() {
    var input = document.getElementById('jsonInput').value.trim();
    if (!input) return;
    try   { showResult(JSON.stringify(sortKeys(JSON.parse(input)), null, getIndent())); }
    catch (e) { showError(e.message); }
  }

  function copyOutput() {
    if (!outputText) return;
    var fb = document.getElementById('copyFeedback');
    function show() { fb.classList.add('copy-feedback--visible'); setTimeout(function() { fb.classList.remove('copy-feedback--visible'); }, 1500); }
    if (navigator.clipboard) { navigator.clipboard.writeText(outputText).then(show); }
    else { var t = document.createElement('textarea'); t.value = outputText; t.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t); show(); }
  }
</script>
