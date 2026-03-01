---
layout: page
title: Random Picker
permalink: /dev/random-picker/
---

Pick one or more random items from a list.

<div class="tool-layout">
  <div class="input-wrapper">
    <label class="input-label" for="listInput">Your list</label>
    <textarea class="textarea-input" id="listInput" placeholder="Apple&#10;Banana&#10;Cherry&#10;Date&#10;Elderberry"></textarea>
  </div>

  <div class="input-group">
    <div class="input-wrapper">
      <label class="input-label" for="pickCount">How many to pick</label>
      <input type="number" class="text-input" id="pickCount" value="1" min="1">
    </div>
  </div>

  <div class="tool-actions">
    <button class="btn btn--primary" onclick="pickItems()">Pick</button>
  </div>

  <div class="output-block">
    <div class="output-block-header">
      <span class="input-label">Picked items</span>
      <span>
        <span class="copy-feedback" id="copyFeedback">Copied!</span>
        <button class="btn btn--small" onclick="copyOutput()">Copy</button>
        <button class="btn btn--small" onclick="downloadOutput('txt')">Download</button>
      </span>
    </div>
    <div class="output-panel output-panel--empty" id="output">Picked items will appear here.</div>
  </div>
</div>

<script>
  var outputEl = document.getElementById('output');

  function pickItems() {
    var input = document.getElementById('listInput').value.trim();
    var count = Math.max(1, parseInt(document.getElementById('pickCount').value) || 1);
    if (!input) return;

    var items = input.split('\n')
      .map(function(s) { return s.trim(); })
      .filter(function(s) { return s.length > 0; });

    count = Math.min(count, items.length);

    for (var i = items.length - 1; i > 0; i--) {
      var j   = Math.floor(Math.random() * (i + 1));
      var tmp = items[i]; items[i] = items[j]; items[j] = tmp;
    }

    window._toolOutput = items.slice(0, count).join('\n');
    outputEl.textContent = window._toolOutput;
    outputEl.className   = 'output-panel';
  }
</script>
