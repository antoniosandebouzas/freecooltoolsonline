---
layout: page
title: Investment Calculator
permalink: /money/investmentcalculator/
---

<script src="https://cdn.plot.ly/plotly-3.0.0.min.js" charset="utf-8"></script>

<div class="tool-form input-group">
  <div class="input-wrapper">
    <label class="input-label" for="years">Duration</label>
    <select id="years" onchange="calculateFutureValue()">
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
    </select>
  </div>

  <div class="input-wrapper">
    <label class="input-label" for="monthlyInvestment">Monthly amount</label>
    <select id="monthlyInvestment" onchange="calculateFutureValue()">
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
    </select>
  </div>

  <div class="input-wrapper">
    <label class="input-label" for="annualInterest">Annual return</label>
    <select id="annualInterest" onchange="calculateFutureValue()">
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
    </select>
  </div>
</div>

<div class="result-cards" id="result">
  <div class="result-card">
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
  var CHART_FONT = "'Google Sans', sans-serif";

  function getChartStyle() {
    var s = getComputedStyle(document.documentElement);
    return {
      invested: s.getPropertyValue('--color-organic-brown').trim() || '#8b7e74',
      profit:   s.getPropertyValue('--color-accent').trim()        || '#1e8e3e',
      future:   s.getPropertyValue('--color-organic-dark').trim()  || '#4a4542',
      bg:       s.getPropertyValue('--color-bg-surface').trim()    || '#ffffff'
    };
  }

  function formatCurrency(value) {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function calculateFutureValue() {
    var years = parseFloat(document.getElementById('years').value);
    var monthlyInvestment = parseFloat(document.getElementById('monthlyInvestment').value);
    var annualInterest = parseFloat(document.getElementById('annualInterest').value);

    var monthlyInterestRate = (annualInterest / 100) / 12;
    var totalMonths = years * 12;

    var futureValues = [];
    var totalInvestments = [];
    var profits = [];
    var annualFutureValues = [];
    var annualTotalInvestments = [];
    var annualProfits = [];

    var futureValue = 0;
    var totalInvestment = 0;

    for (var i = 0; i < totalMonths; i++) {
      futureValue = (futureValue + monthlyInvestment) * (1 + monthlyInterestRate);
      totalInvestment += monthlyInvestment;

      futureValues.push(futureValue);
      totalInvestments.push(totalInvestment);
      profits.push(futureValue - totalInvestment);

      if ((i + 1) % 12 === 0) {
        annualFutureValues.push(futureValue);
        annualTotalInvestments.push(totalInvestment);
        annualProfits.push(futureValue - totalInvestment);
      }
    }

    document.getElementById('futureValue').textContent     = formatCurrency(futureValue);
    document.getElementById('totalInvestment').textContent = formatCurrency(totalInvestment);
    document.getElementById('profit').textContent          = formatCurrency(futureValue - totalInvestment);

    drawChart(futureValues,       totalInvestments,       profits,       'Month', 'investmentChart');
    drawChart(annualFutureValues, annualTotalInvestments, annualProfits, 'Year',  'annualChart');
    drawPieChart(totalInvestment, futureValue - totalInvestment);
  }

  function drawChart(values, invested, profits, axisLabel, chartId) {
    var c      = getChartStyle();
    var count  = values.length;
    var labels = Array.from({ length: count }, function(_, i) { return i + 1; });

    var ticktext;
    if (axisLabel === 'Month') {
      ticktext = labels.map(function(m) {
        return (m % 12 === 0) ? (m / 12) + ' Yr' : '';
      });
    } else {
      ticktext = labels.map(function(y) { return y + ' Yr'; });
    }

    var data = [
      { x: labels, y: values,   type: 'bar', name: 'Final value',    marker: { color: c.future   } },
      { x: labels, y: invested, type: 'bar', name: 'Total invested',  marker: { color: c.invested } },
      { x: labels, y: profits,  type: 'bar', name: 'Interest earned', marker: { color: c.profit   } }
    ];

    var layout = {
      showlegend: true,
      legend: { orientation: 'h', yanchor: 'bottom', y: 1.05, xanchor: 'center', x: 0.5 },
      xaxis: {
        title:    axisLabel === 'Month' ? 'Months' : 'Years',
        tickmode: 'array',
        tickvals: labels,
        ticktext: ticktext,
        tickfont: { family: CHART_FONT }
      },
      yaxis: {
        title:    'Amount (USD)',
        tickfont: { family: CHART_FONT }
      },
      paper_bgcolor: c.bg,
      plot_bgcolor:  c.bg,
      font:   { family: CHART_FONT },
      margin: { t: 40, r: 20, b: 60, l: 80 }
    };

    Plotly.newPlot(chartId, data, layout, { responsive: true });
  }

  function drawPieChart(totalInvestment, profit) {
    var c = getChartStyle();
    var data = [{
      labels: ['Total invested', 'Interest earned'],
      values: [totalInvestment, profit],
      type:   'pie',
      marker: { colors: [c.invested, c.profit] },
      textfont: { family: CHART_FONT }
    }];

    var layout = {
      showlegend: true,
      legend: { orientation: 'h', yanchor: 'bottom', y: 1.05, xanchor: 'center', x: 0.5 },
      paper_bgcolor: c.bg,
      font:   { family: CHART_FONT },
      margin: { t: 40, r: 20, b: 20, l: 20 }
    };

    Plotly.newPlot('investmentPie', data, layout, { responsive: true });
  }

  window.addEventListener('DOMContentLoaded', calculateFutureValue);
</script>
