---
layout: page
title: List Randomizer
permalink: /dev/list-randomizer/
---

Paste a list (one item per line) and shuffle it instantly.

<div class="tool-layout">
  <div class="input-wrapper">
    <label class="input-label" for="listInput">Your list</label>
    <textarea class="textarea-input" id="listInput" placeholder="Apple&#10;Banana&#10;Cherry&#10;Date&#10;Elderberry"></textarea>
  </div>

  <div class="tool-actions">
    <button class="btn btn--primary" onclick="randomizeList()">Shuffle</button>
  </div>

  <div class="output-block">
    <div class="output-block-header">
      <span class="input-label">Shuffled result</span>
      <span>
        <span class="copy-feedback" id="copyFeedback">Copied!</span>
        <button class="btn btn--small" onclick="copyOutput()">Copy</button>
      </span>
    </div>
    <div class="output-panel output-panel--empty" id="output">Shuffled list will appear here.</div>
  </div>
</div>

<script>
  var outputEl = document.getElementById('output');

  function randomizeList() {
    var input = document.getElementById('listInput').value.trim();
    if (!input) return;

    var items = input.split('\n')
      .map(function(s) { return s.trim(); })
      .filter(function(s) { return s.length > 0; });

    for (var i = items.length - 1; i > 0; i--) {
      var j   = Math.floor(Math.random() * (i + 1));
      var tmp = items[i]; items[i] = items[j]; items[j] = tmp;
    }

    window._toolOutput = items.join('\n');
    outputEl.textContent = window._toolOutput;
    outputEl.className   = 'output-panel';
  }
</script>
