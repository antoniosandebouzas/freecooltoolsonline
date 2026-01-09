(function () {
  // Scoped to page container
  function q(selector) { return document.querySelector('.squircles-page ' + selector); }
  function qAll(selector) { return document.querySelectorAll('.squircles-page ' + selector); }

  function calculateContrastTextColor(hexColor) {
    const red = parseInt(hexColor.substr(1, 2), 16);
    const green = parseInt(hexColor.substr(3, 2), 16);
    const blue = parseInt(hexColor.substr(5, 2), 16);
    const yiqLuminance = ((red * 299) + (green * 587) + (blue * 114)) / 1000;
    return (yiqLuminance >= 128) ? '#202124' : '#ffffff';
  }

  function generateSquirclePathData(width, height, exponent) {
    if (width <= 0 || height <= 0) { return ''; }
    const shortestSide = Math.min(width, height);
    const cornerRadius = shortestSide / 2;
    const deltaX = (width - shortestSide) / 2;
    const deltaY = (height - shortestSide) / 2;
    const centerX = width / 2;
    const centerY = height / 2;
    const pointsPerQuadrant = 30;
    let calculatedPoints = [];

    for (let i = 0; i <= pointsPerQuadrant; i++) {
      const theta = (i / pointsPerQuadrant) * (Math.PI / 2);
      const cosineTheta = Math.cos(theta);
      const sineTheta = Math.sin(theta);
      const xPosition = cornerRadius * Math.pow(Math.abs(cosineTheta), 2 / exponent);
      const yPosition = cornerRadius * Math.pow(Math.abs(sineTheta), 2 / exponent);
      calculatedPoints.push({ x: xPosition, y: yPosition });
    }

    let pathDataString = `M ${centerX + calculatedPoints[0].x + deltaX} ${centerY + calculatedPoints[0].y + deltaY}`;
    for (let point of calculatedPoints) { pathDataString += ` L ${centerX + point.x + deltaX} ${centerY + point.y + deltaY}`; }
    for (let i = calculatedPoints.length - 1; i >= 0; i--) { const point = calculatedPoints[i]; pathDataString += ` L ${centerX - point.x - deltaX} ${centerY + point.y + deltaY}`; }
    for (let point of calculatedPoints) { pathDataString += ` L ${centerX - point.x - deltaX} ${centerY - point.y - deltaY}`; }
    for (let i = calculatedPoints.length - 1; i >= 0; i--) { const point = calculatedPoints[i]; pathDataString += ` L ${centerX + point.x + deltaX} ${centerY - point.y - deltaY}`; }
    return pathDataString + ' Z';
  }

  const applicationState = { curvatureExponent: 4.0, customShape: { width: 250, height: 250, color: '#1e8e3e' } };

  const uiElements = {
    sliderInput: q('#exponentSlider'),
    sliderValueDisplay: q('#exponentValueDisplay'),
    presetSquircles: qAll('.visualization-grid .squircle-component'),
    customSquircleElement: q('#customSquircleElement'),
    inputs: { width: q('#inputWidth'), height: q('#inputHeight'), color: q('#inputColor') }
  };

  let animationFrameId = null;

  function renderApplication() {
    uiElements.presetSquircles.forEach(element => {
      const computedStyle = getComputedStyle(element);
      const width = parseFloat(computedStyle.getPropertyValue('--squircle-width'));
      const height = parseFloat(computedStyle.getPropertyValue('--squircle-height'));
      const pathData = generateSquirclePathData(width, height, applicationState.curvatureExponent);
      element.style.setProperty('--squircle-clip-path', `"${pathData}"`);
    });

    const { width, height, color } = applicationState.customShape;
    const customElement = uiElements.customSquircleElement;
    const customPathData = generateSquirclePathData(width, height, applicationState.curvatureExponent);
    customElement.style.setProperty('--squircle-width', `${width}px`);
    customElement.style.setProperty('--squircle-height', `${height}px`);
    customElement.style.setProperty('--squircle-background-color', color);
    customElement.style.setProperty('--squircle-text-color', calculateContrastTextColor(color));
    customElement.style.setProperty('--squircle-clip-path', `"${customPathData}"`);
    const labelElement = customElement.querySelector('.squircle-label');
    if (labelElement) { labelElement.textContent = `${width}×${height}`; }
  }

  function requestRenderUpdate() { if (animationFrameId) cancelAnimationFrame(animationFrameId); animationFrameId = requestAnimationFrame(renderApplication); }

  if (uiElements.sliderInput) {
    uiElements.sliderInput.addEventListener('input', (event) => { const newValue = parseFloat(event.target.value); applicationState.curvatureExponent = newValue; uiElements.sliderValueDisplay.textContent = newValue.toFixed(1); requestRenderUpdate(); });
  }

  function handleCustomInputUpdate() {
    let parsedWidth = parseInt(uiElements.inputs.width.value) || 100;
    let parsedHeight = parseInt(uiElements.inputs.height.value) || 100;
    parsedWidth = Math.max(50, Math.min(600, parsedWidth));
    parsedHeight = Math.max(50, Math.min(600, parsedHeight));
    applicationState.customShape.width = parsedWidth;
    applicationState.customShape.height = parsedHeight;
    applicationState.customShape.color = uiElements.inputs.color.value;
    requestRenderUpdate();
  }

  if (uiElements.inputs.width) uiElements.inputs.width.addEventListener('input', handleCustomInputUpdate);
  if (uiElements.inputs.height) uiElements.inputs.height.addEventListener('input', handleCustomInputUpdate);
  if (uiElements.inputs.color) uiElements.inputs.color.addEventListener('input', handleCustomInputUpdate);

  document.addEventListener('DOMContentLoaded', renderApplication);
})();
