---
layout: page
title: Mortgage Calculator
permalink: /money/mortgagecalculator/
---

<script src="https://cdn.plot.ly/plotly-3.0.0.min.js" charset="utf-8"></script>

<div class="tool-form input-group">
  <div class="input-wrapper">
    <label class="input-label" for="loanAmount">Home price</label>
    <select id="loanAmount" onchange="toggleCustom('loanAmount'); calculateMortgage()">
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
      <option value="custom">Custom…</option>
    </select>
    <input type="number" inputmode="numeric" class="text-input select-custom-input" id="loanAmountCustom"
           placeholder="Amount ($)" min="1" step="1000" oninput="calculateMortgage()">
  </div>

  <div class="input-wrapper">
    <label class="input-label" for="downPayment">Down payment</label>
    <select id="downPayment" onchange="toggleCustom('downPayment'); calculateMortgage()">
      <option value="0" selected>0%</option>
      <option value="5">5%</option>
      <option value="10">10%</option>
      <option value="15">15%</option>
      <option value="20">20%</option>
      <option value="25">25%</option>
      <option value="30">30%</option>
      <option value="custom">Custom…</option>
    </select>
    <input type="number" inputmode="decimal" class="text-input select-custom-input" id="downPaymentCustom"
           placeholder="%" min="0" max="99" step="0.5" oninput="calculateMortgage()">
  </div>

  <div class="input-wrapper">
    <label class="input-label" for="annualRate">Annual rate</label>
    <select id="annualRate" onchange="toggleCustom('annualRate'); calculateMortgage()">
      <option value="0.0">0.0%</option>
      <option value="5.1">5.1%</option>
      <option value="5.2">5.2%</option>
      <option value="5.3">5.3%</option>
      <option value="5.4">5.4%</option>
      <option value="5.5">5.5%</option>
      <option value="5.6">5.6%</option>
      <option value="5.7">5.7%</option>
      <option value="5.8">5.8%</option>
      <option value="5.9">5.9%</option>
      <option value="6.0" selected>6.0%</option>
      <option value="6.1">6.1%</option>
      <option value="6.2">6.2%</option>
      <option value="6.3">6.3%</option>
      <option value="6.4">6.4%</option>
      <option value="6.5">6.5%</option>
      <option value="6.6">6.6%</option>
      <option value="6.7">6.7%</option>
      <option value="6.8">6.8%</option>
      <option value="6.9">6.9%</option>
      <option value="custom">Custom…</option>
    </select>
    <input type="number" inputmode="decimal" class="text-input select-custom-input" id="annualRateCustom"
           placeholder="Rate (%)" min="0" step="0.1" oninput="calculateMortgage()">
  </div>

  <div class="input-wrapper">
    <label class="input-label" for="loanTerm">Loan term</label>
    <select id="loanTerm" onchange="toggleCustom('loanTerm'); calculateMortgage()">
      <option value="5">5 years</option>
      <option value="10">10 years</option>
      <option value="15">15 years</option>
      <option value="20">20 years</option>
      <option value="25">25 years</option>
      <option value="30" selected>30 years</option>
      <option value="custom">Custom…</option>
    </select>
    <input type="number" inputmode="numeric" class="text-input select-custom-input" id="loanTermCustom"
           placeholder="Years" min="1" step="1" oninput="calculateMortgage()">
  </div>
</div>

<div class="result-cards">
  <div class="result-card result-card--blue">
    <div class="result-card__label">Monthly payment</div>
    <div class="result-card__value" id="monthlyPayment">—</div>
  </div>
  <div class="result-card">
    <div class="result-card__label">Down payment</div>
    <div class="result-card__value" id="downPaymentAmt">—</div>
  </div>
  <div class="result-card result-card--red">
    <div class="result-card__label">Total interest</div>
    <div class="result-card__value" id="totalInterest">—</div>
  </div>
  <div class="result-card">
    <div class="result-card__label">Total paid</div>
    <div class="result-card__value" id="totalPaid">—</div>
  </div>
</div>

## Payment Breakdown
<div class="tool-chart" id="mortgagePie"></div>

## Amortization — Annual Breakdown
<div class="tool-chart" id="amortizationChart"></div>

<script>
  function calculateMortgage() {
    var homePrice      = val('loanAmount');
    var downPaymentPct = val('downPayment') || 0;
    var annualRate     = val('annualRate');
    var termYears      = val('loanTerm');

    if (homePrice === null || annualRate === null || termYears === null) return;
    if (homePrice <= 0 || termYears <= 0 || downPaymentPct < 0 || downPaymentPct >= 100) return;

    var downPaymentAmt = homePrice * downPaymentPct / 100;
    var principal      = homePrice - downPaymentAmt;
    if (principal <= 0) return;

    var monthlyRate = (annualRate / 100) / 12;
    var numPayments = termYears * 12;

    var monthlyPayment;
    if (monthlyRate === 0) {
      monthlyPayment = principal / numPayments;
    } else {
      var factor = Math.pow(1 + monthlyRate, numPayments);
      monthlyPayment = principal * (monthlyRate * factor) / (factor - 1);
    }

    var totalMortgagePaid = monthlyPayment * numPayments;
    var totalInterest     = totalMortgagePaid - principal;
    var totalPaid         = downPaymentAmt + totalMortgagePaid;

    document.getElementById('monthlyPayment').textContent = formatCurrency(monthlyPayment);
    document.getElementById('downPaymentAmt').textContent = formatCurrency(downPaymentAmt);
    document.getElementById('totalInterest').textContent  = formatCurrency(totalInterest);
    document.getElementById('totalPaid').textContent      = formatCurrency(totalPaid);

    var balance = principal;
    var annualPrincipal = [], annualInterestArr = [];
    var accPrincipal = 0, accInterest = 0;

    for (var i = 0; i < numPayments; i++) {
      var iPayment = balance * monthlyRate;
      var pPayment = monthlyPayment - iPayment;
      balance      -= pPayment;
      accPrincipal += pPayment;
      accInterest  += iPayment;

      if ((i + 1) % 12 === 0) {
        annualPrincipal.push(accPrincipal);
        annualInterestArr.push(accInterest);
        accPrincipal = 0;
        accInterest  = 0;
      }
    }

    drawPieChart(downPaymentAmt, principal, totalInterest);
    drawAmortizationChart(annualPrincipal, annualInterestArr, termYears);
  }

  function drawPieChart(downPayment, principal, totalInterest) {
    var c = getChartColors();
    var labels, values, colors;
    if (downPayment > 0) {
      labels = ['Down payment', 'Principal', 'Total interest'];
      values = [downPayment, principal, totalInterest];
      colors = [c.neutral, c.blue, c.red];
    } else {
      labels = ['Principal', 'Total interest'];
      values = [principal, totalInterest];
      colors = [c.blue, c.red];
    }
    Plotly.newPlot('mortgagePie', [{
      labels: labels, values: values, type: 'pie',
      marker: { colors: colors },
      textfont: { family: CHART_FONT }
    }], {
      showlegend: true,
      legend: { orientation: 'h', yanchor: 'bottom', y: 1.05, xanchor: 'center', x: 0.5 },
      paper_bgcolor: c.bg,
      font: { family: CHART_FONT },
      margin: { t: 40, r: 20, b: 20, l: 20 }
    }, { responsive: true });
  }

  function drawAmortizationChart(annualPrincipal, annualInterest, termYears) {
    var c     = getChartColors();
    var years = Array.from({ length: termYears }, function(_, i) { return i + 1; });
    var labels = years.map(function(y) { return y + ' Yr'; });

    Plotly.newPlot('amortizationChart', [
      { x: years, y: annualPrincipal, type: 'bar', name: 'Principal paid', marker: { color: c.blue } },
      { x: years, y: annualInterest,  type: 'bar', name: 'Interest paid',  marker: { color: c.red  } }
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

  window.addEventListener('DOMContentLoaded', calculateMortgage);
</script>
