---
layout: page
title: Mortgage Calculator
permalink: /money/mortgagecalculator/
---

<script src="https://cdn.plot.ly/plotly-3.0.0.min.js" charset="utf-8"></script>

<div class="tool-form input-group">
  <div class="input-wrapper">
    <label class="input-label" for="loanAmount">Loan amount</label>
    <select id="loanAmount" onchange="calculateMortgage()">
      <option value="50000">$50,000</option>
      <option value="100000">$100,000</option>
      <option value="150000">$150,000</option>
      <option value="200000">$200,000</option>
      <option value="250000">$250,000</option>
      <option value="300000" selected>$300,000</option>
      <option value="350000">$350,000</option>
      <option value="400000">$400,000</option>
      <option value="500000">$500,000</option>
      <option value="600000">$600,000</option>
      <option value="750000">$750,000</option>
      <option value="1000000">$1,000,000</option>
      <option value="1500000">$1,500,000</option>
      <option value="2000000">$2,000,000</option>
    </select>
  </div>

  <div class="input-wrapper">
    <label class="input-label" for="annualRate">Annual rate</label>
    <select id="annualRate" onchange="calculateMortgage()">
      <option value="1.0">1.0%</option>
      <option value="1.5">1.5%</option>
      <option value="2.0">2.0%</option>
      <option value="2.5">2.5%</option>
      <option value="3.0">3.0%</option>
      <option value="3.5">3.5%</option>
      <option value="4.0">4.0%</option>
      <option value="4.5">4.5%</option>
      <option value="5.0">5.0%</option>
      <option value="5.5">5.5%</option>
      <option value="6.0">6.0%</option>
      <option value="6.5" selected>6.5%</option>
      <option value="7.0">7.0%</option>
      <option value="7.5">7.5%</option>
      <option value="8.0">8.0%</option>
      <option value="8.5">8.5%</option>
      <option value="9.0">9.0%</option>
      <option value="9.5">9.5%</option>
      <option value="10.0">10.0%</option>
    </select>
  </div>

  <div class="input-wrapper">
    <label class="input-label" for="loanTerm">Loan term</label>
    <select id="loanTerm" onchange="calculateMortgage()">
      <option value="5">5 years</option>
      <option value="10">10 years</option>
      <option value="15">15 years</option>
      <option value="20">20 years</option>
      <option value="25">25 years</option>
      <option value="30" selected>30 years</option>
    </select>
  </div>
</div>

<div class="result-cards">
  <div class="result-card result-card--accent">
    <div class="result-card__label">Monthly payment</div>
    <div class="result-card__value" id="monthlyPayment">—</div>
  </div>
  <div class="result-card">
    <div class="result-card__label">Total interest</div>
    <div class="result-card__value" id="totalInterest">—</div>
  </div>
  <div class="result-card">
    <div class="result-card__label">Total paid</div>
    <div class="result-card__value" id="totalPaid">—</div>
  </div>
</div>

## Principal vs Interest
<div class="tool-chart" id="mortgagePie"></div>

## Amortization — Annual Breakdown
<div class="tool-chart" id="amortizationChart"></div>

<script>
  var CHART_FONT = "'Google Sans', sans-serif";

  function getChartStyle() {
    var s = getComputedStyle(document.documentElement);
    return {
      principal: s.getPropertyValue('--color-accent').trim()        || '#1e8e3e',
      interest:  s.getPropertyValue('--color-organic-brown').trim() || '#8b7e74',
      bg:        s.getPropertyValue('--color-bg-surface').trim()    || '#ffffff'
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

  function calculateMortgage() {
    var principal  = parseFloat(document.getElementById('loanAmount').value);
    var annualRate = parseFloat(document.getElementById('annualRate').value);
    var termYears  = parseFloat(document.getElementById('loanTerm').value);

    var monthlyRate  = (annualRate / 100) / 12;
    var numPayments  = termYears * 12;

    var monthlyPayment;
    if (monthlyRate === 0) {
      monthlyPayment = principal / numPayments;
    } else {
      var factor = Math.pow(1 + monthlyRate, numPayments);
      monthlyPayment = principal * (monthlyRate * factor) / (factor - 1);
    }

    var totalPaid     = monthlyPayment * numPayments;
    var totalInterest = totalPaid - principal;

    document.getElementById('monthlyPayment').textContent = formatCurrency(monthlyPayment);
    document.getElementById('totalInterest').textContent  = formatCurrency(totalInterest);
    document.getElementById('totalPaid').textContent      = formatCurrency(totalPaid);

    // Build annual amortization data
    var balance = principal;
    var annualPrincipal = [];
    var annualInterest  = [];
    var accPrincipal = 0, accInterest = 0;

    for (var i = 0; i < numPayments; i++) {
      var iPayment = balance * monthlyRate;
      var pPayment = monthlyPayment - iPayment;
      balance      -= pPayment;
      accPrincipal += pPayment;
      accInterest  += iPayment;

      if ((i + 1) % 12 === 0) {
        annualPrincipal.push(accPrincipal);
        annualInterest.push(accInterest);
        accPrincipal = 0;
        accInterest  = 0;
      }
    }

    drawPieChart(principal, totalInterest);
    drawAmortizationChart(annualPrincipal, annualInterest, termYears);
  }

  function drawPieChart(principal, totalInterest) {
    var c = getChartStyle();
    var data = [{
      labels: ['Principal', 'Total interest'],
      values: [principal, totalInterest],
      type:   'pie',
      marker: { colors: [c.principal, c.interest] },
      textfont: { family: CHART_FONT }
    }];

    Plotly.newPlot('mortgagePie', data, {
      showlegend: true,
      legend: { orientation: 'h', yanchor: 'bottom', y: 1.05, xanchor: 'center', x: 0.5 },
      paper_bgcolor: c.bg,
      font:   { family: CHART_FONT },
      margin: { t: 40, r: 20, b: 20, l: 20 }
    }, { responsive: true });
  }

  function drawAmortizationChart(annualPrincipal, annualInterest, termYears) {
    var c      = getChartStyle();
    var years  = Array.from({ length: termYears }, function(_, i) { return i + 1; });
    var labels = years.map(function(y) { return y + ' Yr'; });

    var data = [
      {
        x: years, y: annualPrincipal,
        type: 'bar', name: 'Principal paid',
        marker: { color: c.principal }
      },
      {
        x: years, y: annualInterest,
        type: 'bar', name: 'Interest paid',
        marker: { color: c.interest }
      }
    ];

    Plotly.newPlot('amortizationChart', data, {
      barmode: 'stack',
      showlegend: true,
      legend: { orientation: 'h', yanchor: 'bottom', y: 1.05, xanchor: 'center', x: 0.5 },
      xaxis: {
        title:    'Years',
        tickmode: 'array',
        tickvals: years,
        ticktext: labels,
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
    }, { responsive: true });
  }

  window.addEventListener('DOMContentLoaded', calculateMortgage);
</script>
