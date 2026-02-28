---
layout: page
title: Sequence Generator
permalink: /dev/sequence-generator/
---

Generate numeric sequences with a custom prefix, suffix, and separator.

<div class="tool-layout">
  <div class="input-group">
    <div class="input-wrapper">
      <label class="input-label" for="seqStart">From</label>
      <input type="number" class="text-input" id="seqStart" value="1">
    </div>
    <div class="input-wrapper">
      <label class="input-label" for="seqEnd">To</label>
      <input type="number" class="text-input" id="seqEnd" value="10">
    </div>
    <div class="input-wrapper">
      <label class="input-label" for="seqStep">Step</label>
      <input type="number" class="text-input" id="seqStep" value="1">
    </div>
    <div class="input-wrapper">
      <label class="input-label" for="seqPad">Zero-pad width</label>
      <input type="number" class="text-input" id="seqPad" value="0" min="0" max="20" placeholder="0 = off">
    </div>
  </div>

  <div class="input-group">
    <div class="input-wrapper">
      <label class="input-label" for="seqPrefix">Prefix</label>
      <input type="text" class="text-input" id="seqPrefix" placeholder="e.g. item_">
    </div>
    <div class="input-wrapper">
      <label class="input-label" for="seqSuffix">Suffix</label>
      <input type="text" class="text-input" id="seqSuffix" placeholder="e.g. ;">
    </div>
    <div class="input-wrapper">
      <label class="input-label" for="seqSep">Separator</label>
      <input type="text" class="text-input" id="seqSep" value="\n" placeholder="\n or ,">
    </div>
  </div>

  <div class="tool-actions">
    <button class="btn btn--primary" onclick="generateSeq()">Generate</button>
  </div>

  <div class="output-block">
    <div class="output-block-header">
      <span class="input-label">Result</span>
      <span>
        <span class="copy-feedback" id="copyFeedback">Copied!</span>
        <button class="btn btn--small" onclick="copyOutput()">Copy</button>
      </span>
    </div>
    <div class="output-panel output-panel--empty" id="output">Sequence will appear here.</div>
  </div>
</div>

<script>
  var outputEl = document.getElementById('output');

  function zeroPad(n, width) {
    var s = String(Math.abs(n));
    while (s.length < width) s = '0' + s;
    return (n < 0 ? '-' : '') + s;
  }

  function generateSeq() {
    var start  = parseFloat(document.getElementById('seqStart').value);
    var end    = parseFloat(document.getElementById('seqEnd').value);
    var step   = parseFloat(document.getElementById('seqStep').value) || 1;
    var padW   = parseInt(document.getElementById('seqPad').value)    || 0;
    var prefix = document.getElementById('seqPrefix').value;
    var suffix = document.getElementById('seqSuffix').value;
    var sep    = document.getElementById('seqSep').value
                   .replace(/\\n/g, '\n')
                   .replace(/\\t/g, '\t');

    if (isNaN(start) || isNaN(end) || step === 0) return;

    var items = [];
    for (var i = 0; ; i++) {
      var n = parseFloat((start + i * step).toPrecision(12));
      if (step > 0 ? n > end : n < end) break;
      var numStr = padW > 0 ? zeroPad(n, padW) : String(n);
      items.push(prefix + numStr + suffix);
      if (items.length >= 10000) { items.push('… (truncated at 10,000 items)'); break; }
    }

    window._toolOutput = items.join(sep);
    outputEl.textContent = window._toolOutput;
    outputEl.className   = 'output-panel';
  }

  window.addEventListener('DOMContentLoaded', generateSeq);
</script>
