---
layout: page
title: Investment Calculator
permalink: /money/investmentcalculator/
---

<script src="https://cdn.plot.ly/plotly-3.0.0.min.js" charset="utf-8"></script>

<div class="tool-form input-group">
  <div class="input-wrapper">
    <label class="input-label" for="years">Duration</label>
    <select id="years" onchange="toggleCustom('years'); calculateFutureValue()">
      <option value="1">1 year</option>
      <option value="2">2 years</option>
      <option value="3">3 years</option>
      <option value="4">4 years</option>
      <option value="5">5 years</option>
      <option value="10">10 years</option>
      <option value="15">15 years</option>
      <option value="20" selected>20 years</option>
      <option value="25">25 years</option>
      <option value="30">30 years</option>
      <option value="35">35 years</option>
      <option value="40">40 years</option>
      <option value="50">50 years</option>
      <option value="60">60 years</option>
      <option value="70">70 years</option>
      <option value="80">80 years</option>
      <option value="90">90 years</option>
      <option value="100">100 years</option>
      <option value="custom">Custom…</option>
    </select>
    <input type="number" inputmode="numeric" class="text-input select-custom-input" id="yearsCustom"
           placeholder="Years" min="1" step="1" oninput="calculateFutureValue()">
  </div>

  <div class="input-wrapper">
    <label class="input-label" for="initialInvestment">Initial investment</label>
    <select id="initialInvestment" onchange="toggleCustom('initialInvestment'); calculateFutureValue()">
      <option value="0" selected>$0</option>
      <option value="500">$500</option>
      <option value="1000">$1,000</option>
      <option value="2500">$2,500</option>
      <option value="5000">$5,000</option>
      <option value="10000">$10,000</option>
      <option value="25000">$25,000</option>
      <option value="50000">$50,000</option>
      <option value="100000">$100,000</option>
      <option value="custom">Custom…</option>
    </select>
    <input type="number" inputmode="numeric" class="text-input select-custom-input" id="initialInvestmentCustom"
           placeholder="Amount ($)" min="0" step="1" oninput="calculateFutureValue()">
  </div>

  <div class="input-wrapper">
    <label class="input-label" for="monthlyInvestment">Monthly amount</label>
    <select id="monthlyInvestment" onchange="toggleCustom('monthlyInvestment'); calculateFutureValue()">
      <option value="10">$10</option>
      <option value="20">$20</option>
      <option value="50">$50</option>
      <option value="100" selected>$100</option>
      <option value="200">$200</option>
      <option value="500">$500</option>
      <option value="1000">$1,000</option>
      <option value="2000">$2,000</option>
      <option value="5000">$5,000</option>
      <option value="10000">$10,000</option>
      <option value="custom">Custom…</option>
    </select>
    <input type="number" inputmode="numeric" class="text-input select-custom-input" id="monthlyInvestmentCustom"
           placeholder="Amount ($)" min="0" step="1" oninput="calculateFutureValue()">
  </div>

  <div class="input-wrapper">
    <label class="input-label" for="annualInterest">Annual return</label>
    <select id="annualInterest" onchange="toggleCustom('annualInterest'); calculateFutureValue()">
      <option value="0.0">0.0%</option>
      <option value="0.5">0.5%</option>
      <option value="1.0">1.0%</option>
      <option value="1.5">1.5%</option>
      <option value="2.0">2.0%</option>
      <option value="2.5">2.5%</option>
      <option value="3.0">3.0%</option>
      <option value="3.5">3.5%</option>
      <option value="4.0">4.0%</option>
      <option value="4.5">4.5%</option>
      <option value="5.0" selected>5.0%</option>
      <option value="5.5">5.5%</option>
      <option value="6.0">6.0%</option>
      <option value="6.5">6.5%</option>
      <option value="7.0">7.0%</option>
      <option value="7.5">7.5%</option>
      <option value="8.0">8.0%</option>
      <option value="8.5">8.5%</option>
      <option value="9.0">9.0%</option>
      <option value="9.5">9.5%</option>
      <option value="10.0">10.0%</option>
      <option value="10.5">10.5%</option>
      <option value="custom">Custom…</option>
    </select>
    <input type="number" inputmode="decimal" class="text-input select-custom-input" id="annualInterestCustom"
           placeholder="Rate (%)" min="0" step="0.1" oninput="calculateFutureValue()">
  </div>
</div>

<div class="result-cards" id="result">
  <div class="result-card result-card--blue">
    <div class="result-card__label">Total invested</div>
    <div class="result-card__value" id="totalInvestment">—</div>
  </div>
  <div class="result-card result-card--accent">
    <div class="result-card__label">Interest earned</div>
    <div class="result-card__value" id="profit">—</div>
  </div>
  <div class="result-card">
    <div class="result-card__label">Final value</div>
    <div class="result-card__value" id="futureValue">—</div>
  </div>
</div>

## Investment Breakdown
<div class="tool-chart" id="investmentPie"></div>

## Growth Timeline
<div class="tool-chart" id="investmentChart"></div>

## Annual Progress
<div class="tool-chart" id="annualChart"></div>

<script>
  function calculateFutureValue() {
    var years             = val('years');
    var initialInvestment = val('initialInvestment') || 0;
    var monthlyInvestment = val('monthlyInvestment');
    var annualInterest    = val('annualInterest');

    if (years === null || monthlyInvestment === null || annualInterest === null) return;
    if (years <= 0 || monthlyInvestment < 0 || initialInvestment < 0) return;
    if (initialInvestment === 0 && monthlyInvestment === 0) return;

    var monthlyInterestRate = (annualInterest / 100) / 12;
    var totalMonths = years * 12;

    var totalInvestments = [], profits = [];
    var annualTotalInvestments = [], annualProfits = [];
    var futureValue = initialInvestment, totalContributions = 0;

    for (var i = 0; i < totalMonths; i++) {
      futureValue = (futureValue + monthlyInvestment) * (1 + monthlyInterestRate);
      totalContributions += monthlyInvestment;

      var invested = initialInvestment + totalContributions;
      totalInvestments.push(invested);
      profits.push(futureValue - invested);

      if ((i + 1) % 12 === 0) {
        annualTotalInvestments.push(invested);
        annualProfits.push(futureValue - invested);
      }
    }

    var totalInvested = initialInvestment + totalContributions;
    document.getElementById('futureValue').textContent     = formatCurrency(futureValue);
    document.getElementById('totalInvestment').textContent = formatCurrency(totalInvested);
    document.getElementById('profit').textContent          = formatCurrency(futureValue - totalInvested);

    drawMonthlyChart(totalInvestments, profits);
    drawAnnualChart(annualTotalInvestments, annualProfits, years);
    drawPieChart(totalInvested, futureValue - totalInvested);
  }

  function drawMonthlyChart(invested, profits) {
    var c      = getChartColors();
    var count  = invested.length;
    var months = Array.from({ length: count }, function(_, i) { return i + 1; });

    var tickvals = [], ticktext = [];
    for (var m = 12; m <= count; m += 12) {
      tickvals.push(m);
      ticktext.push((m / 12) + ' Yr');
    }

    Plotly.newPlot('investmentChart', [
      {
        x: months, y: invested, type: 'scatter', mode: 'lines', name: 'Total invested',
        fill: 'tozeroy', line: { color: c.blue, width: 2 },
        fillcolor: hexToRgba(c.blue, 0.2)
      },
      {
        x: months,
        y: profits.map(function(p, i) { return invested[i] + p; }),
        type: 'scatter', mode: 'lines', name: 'Final value',
        fill: 'tonexty', line: { color: c.green, width: 2 },
        fillcolor: hexToRgba(c.green, 0.25)
      }
    ], {
      showlegend: true,
      legend: { orientation: 'h', yanchor: 'bottom', y: 1.05, xanchor: 'center', x: 0.5 },
      xaxis: { title: 'Months', tickmode: 'array', tickvals: tickvals, ticktext: ticktext, tickfont: { family: CHART_FONT } },
      yaxis: { title: 'Amount (USD)', tickfont: { family: CHART_FONT } },
      paper_bgcolor: c.bg, plot_bgcolor: c.bg,
      font: { family: CHART_FONT },
      margin: { t: 40, r: 20, b: 60, l: 80 }
    }, { responsive: true });
  }

  function drawAnnualChart(invested, profits, termYears) {
    var c     = getChartColors();
    var years = Array.from({ length: termYears }, function(_, i) { return i + 1; });
    var labels = years.map(function(y) { return y + ' Yr'; });

    Plotly.newPlot('annualChart', [
      { x: years, y: invested, type: 'bar', name: 'Total invested',  marker: { color: c.blue  } },
      { x: years, y: profits,  type: 'bar', name: 'Interest earned', marker: { color: c.green } }
    ], {
      barmode: 'stack',
      showlegend: true,
      legend: { orientation: 'h', yanchor: 'bottom', y: 1.05, xanchor: 'center', x: 0.5 },
      xaxis: { title: 'Years', tickmode: 'array', tickvals: years, ticktext: labels, tickfont: { family: CHART_FONT } },
      yaxis: { title: 'Amount (USD)', tickfont: { family: CHART_FONT } },
      paper_bgcolor: c.bg, plot_bgcolor: c.bg,
      font: { family: CHART_FONT },
      margin: { t: 40, r: 20, b: 60, l: 80 }
    }, { responsive: true });
  }

  function drawPieChart(totalInvestment, profit) {
    var c = getChartColors();
    Plotly.newPlot('investmentPie', [{
      labels: ['Total invested', 'Interest earned'],
      values: [totalInvestment, profit],
      type: 'pie',
      marker: { colors: [c.blue, c.green] },
      textfont: { family: CHART_FONT }
    }], {
      showlegend: true,
      legend: { orientation: 'h', yanchor: 'bottom', y: 1.05, xanchor: 'center', x: 0.5 },
      paper_bgcolor: c.bg,
      font: { family: CHART_FONT },
      margin: { t: 40, r: 20, b: 20, l: 20 }
    }, { responsive: true });
  }

  window.addEventListener('DOMContentLoaded', calculateFutureValue);
</script>
