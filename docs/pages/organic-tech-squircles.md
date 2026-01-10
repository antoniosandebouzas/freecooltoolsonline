---
layout: page
title: Organic Tech Squircles
permalink: /squircles/
squircles: true
---

<h1>Organic Tech Squircles</h1>
<p class="description">A mathematical exploration of form. These shapes transition linearly between diamond and square.<br>Colors are chosen to represent stability (Beige/Brown) and execution (Green).</p>

  <div class="controls-panel">
    <label for="exponentSlider" class="control-label">Curvature</label>
    <input type="range" id="exponentSlider" min="0.5" max="12" step="0.1" value="4">
    <span id="exponentValueDisplay" class="slider-value-display">4.0</span>
  </div>

  <div class="visualization-grid" id="presetContainer">
    <div class="squircle-component variant-neutral-1">
      <div class="squircle-name">Standard</div>
      <div class="squircle-label">120×120</div>
    </div>

    <div class="squircle-component variant-neutral-2">
      <div class="squircle-name">Medium</div>
      <div class="squircle-label">220×160</div>
    </div>

    <div class="squircle-component variant-organic-beige">
      <div class="squircle-name">Beige</div>
      <div class="squircle-label">300×200</div>
    </div>

    <div class="squircle-component variant-organic-brown">
      <div class="squircle-name">Earth</div>
      <div class="squircle-label">250×350</div>
    </div>

    <div class="squircle-component variant-organic-dark">
      <div class="squircle-name">Deep</div>
      <div class="squircle-label">400×100</div>
    </div>
  </div>

  <section class="generator-section">
    <h2>Custom Generator</h2>
    <div class="generator-interface">
      <div class="input-group">
        <div class="input-wrapper">
          <label for="inputWidth" class="input-label">Width (px)</label>
          <input type="number" id="inputWidth" class="text-input" value="250" min="50" max="600">
        </div>

        <div class="input-wrapper">
          <label for="inputHeight" class="input-label">Height (px)</label>
          <input type="number" id="inputHeight" class="text-input" value="250" min="50" max="600">
        </div>

        <div class="input-wrapper">
          <label for="inputColor" class="input-label">Accent</label>
          <div class="color-input-container">
            <input type="color" id="inputColor" value="#1e8e3e">
          </div>
        </div>
      </div>

      <div id="customSquircleElement" class="squircle-component" style="--squircle-width: 250px; --squircle-height: 250px; --squircle-background-color: #1e8e3e; --squircle-text-color: #ffffff;">
        <div class="squircle-name">Generated</div>
        <div class="squircle-label">250×250</div>
      </div>
    </div>
  </section>

  <section class="demo-section" aria-label="Code and blocks demo">
    <h2>Code & Blocks Demo</h2>
    <p>Inline example: <code class="inline">exponent: 4</code> — this inline code is styled with a squircle shape and font.</p>

    <pre><code>/* CSS example */
.squircle-rect { /* ... */ }
</code></pre>

    <blockquote class="squircle-rect squircle-rect--accent" data-squircle-color="#1e8e3e">These shapes create a softer, more organic UI language — great for small UI components and code blocks.</blockquote>

    <p>Author: <strong>Toni</strong> — <a href="mailto:toni@freecooltoolsonline.com">toni@freecooltoolsonline.com</a></p>
  </section>
