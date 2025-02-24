---
layout: page
title: Investment Calculator
permalink: /projects/investmentcalculator/
---

<style>
  button {
    display: none;
  }
</style>
<script src="https://cdn.plot.ly/plotly-3.0.0.min.js" charset="utf-8"></script>

<label for="years">Years investing:</label>
<select id="years" onchange="calculateFutureValue()">
  <option value="1">1yr</option>
  <option value="2">2yr</option>
  <option value="3">3yr</option>
  <option value="4">4yr</option>
  <option value="5">5yr</option>
  <option value="10">10yr</option>
  <option value="15">15yr</option>
  <option value="20" selected="selected" >20yr</option>
  <option value="25">25yr</option>
  <option value="30">30yr</option>
  <option value="35">35yr</option>
  <option value="40">40yr</option>
  <option value="50">50yr</option>
  <option value="60">60yr</option>
  <option value="70">70yr</option>
  <option value="80">80yr</option>
  <option value="90">90yr</option>
  <option value="100">100yr</option>
</select><br>

<label for="monthlyInvestment">Money invested monthly:</label>
<select id="monthlyInvestment" onchange="calculateFutureValue()">
  <option value="10">$10</option>
  <option value="20">$20</option>
  <option value="50">$50</option>
  <option value="100" selected="selected" >$100</option>
  <option value="200">$200</option>
  <option value="500">$500</option>
  <option value="1000">$1,000</option>
  <option value="2000">$2,000</option>
  <option value="5000">$5,000</option>
  <option value="10000">$10,000</option>
</select><br>

<label for="annualInterest">Annual interest rate:</label>
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
  <option value="5.0" selected="selected" >5.0%</option>
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
</select><br>

<div id="result">
  <p id="totalInvestment" style="color: rgb(191, 191, 191);"></p>
  <p id="futureValue" style="color: rgb(63, 127, 255);"></p>
  <p id="profit" style="color: rgb(63, 255, 127);"></p>
</div>

<!-- Add these markdown headings before each chart -->
## Investment Breakdown
<div class="card" id="investmentPie"></div>

## Growth Timeline
<div class="card" id="investmentChart"></div>

## Annual Progress
<div class="card" id="annualChart"></div>

<script>
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
    totalInvestments = [];
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

      // Track annual values
      if ((i + 1) % 12 === 0) {
        annualFutureValues.push(futureValue);
        annualTotalInvestments.push(totalInvestment);
        annualProfits.push(futureValue - totalInvestment);
      }
    }

    // Usage remains the same
    document.getElementById('futureValue').innerText = 'Future value: ' + formatCurrency(futureValue);
    document.getElementById('totalInvestment').innerText = 'Total money invested: ' + formatCurrency(totalInvestment);
    document.getElementById('profit').innerText = 'Profit from interests: ' + formatCurrency(futureValue - totalInvestment);

    // Draw the histograms using Plotly
    drawHistogram(futureValues, totalInvestments, profits, totalMonths, 'investmentChart', 'Investment Analysis Over the Months');
    drawHistogram(annualFutureValues, annualTotalInvestments, annualProfits, years, 'annualChart', 'Annual Investment Analysis', totalMonths); // Display all months in the specified years

    // Draw the pie chart
    drawPieChart(totalInvestment, futureValue - totalInvestment);
  }

  function drawHistogram(values, totalInvestments, profits, xLabels, chartId, title, displayMonths = values.length) {
    var months = Array.from({ length: displayMonths }, (_, i) => i + 1); // Start from 1

    var valueTrace = {
      x: months,
      y: values.slice(0, displayMonths),
      type: 'bar',
      name: 'Future value',
      marker: {
        color: 'rgb(63, 127, 255)' // Apple-like blue
      }
    };

    var totalInvestmentTrace = {
      x: months,
      y: totalInvestments.slice(0, displayMonths),
      type: 'bar',
      name: 'Total money invested',
      marker: {
        color: 'rgb(191, 191, 191)' // Light gray
      }
    };

    var profitTrace = {
      x: months,
      y: profits.slice(0, displayMonths),
      type: 'bar',
      name: 'Profit from interests',
      marker: {
        color: 'rgb(63, 255, 127)' // Apple-like green
      }
    };

    var layout = {
      title: '',
      showlegend: true,
      legend: {
        orientation: 'h',
        yanchor: 'bottom',
        y: 1.05,
        xanchor: 'center',
        x: 0.5
      },
      xaxis: {
        title: xLabels === 'Months' ? 'Months' : 'Years',
        color: '#000',
        tickmode: 'array',
        tickvals: months,
        ticktext: months.map(m => (m % 12 === 0) ? Math.floor(m / 12) + ' Yr ' + (m % 12 || 12) + ' Mo' : ''),
        tickfont: {
          family: '"Rubik", -apple-system, BlinkMacSystemFont, "Segoe UI", SegoeUI, "Helvetica Neue", Helvetica, Arial, sans-serif'
        }
      },
      yaxis: {
        title: 'Amount ($)',
        color: '#000',
        tickfont: {
          family: '"Rubik", -apple-system, BlinkMacSystemFont, "Segoe UI", SegoeUI, "Helvetica Neue", Helvetica, Arial, sans-serif'
        }
      },
      paper_bgcolor: '#FFF',
      plot_bgcolor: '#FFF',
      font: {
        family: '"Rubik", -apple-system, BlinkMacSystemFont, "Segoe UI", SegoeUI, "Helvetica Neue", Helvetica, Arial, sans-serif'
      }
    };

    Plotly.newPlot(chartId, [valueTrace, totalInvestmentTrace, profitTrace], layout);
  }

  function drawPieChart(totalInvestment, profit) {
    var pieData = [{
      labels: ['Total money invested', 'Profit from interests'],
      values: [totalInvestment, profit],
      type: 'pie',
      marker: {
        colors: ['rgb(191, 191, 191)', 'rgb(63, 255, 127)'] // Light gray and Apple-like green
      }
    }];

    var pieLayout = {
      title: '',
      showlegend: true,
      legend: {
        orientation: 'h',
        yanchor: 'bottom',
        y: 1.05,
        xanchor: 'center',
        x: 0.5
      },
      paper_bgcolor: '#FFF',
      plot_bgcolor: '#FFF',
      font: {
        family: '"Rubik", -apple-system, BlinkMacSystemFont, "Segoe UI", SegoeUI, "Helvetica Neue", Helvetica, Arial, sans-serif'
      }
    };

    Plotly.newPlot('investmentPie', pieData, pieLayout);
  }

  // Calculate and display histograms with initial values when the page is loaded
  window.onload = calculateFutureValue;
</script>
