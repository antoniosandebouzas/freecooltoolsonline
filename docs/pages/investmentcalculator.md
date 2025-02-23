---
layout: page
title: Investment Calculator
permalink: /projects/investmentcalculator/
---

<style>
  select {
    padding: 10px;
    margin: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
    outline: none;
  }

  button {
    display: none;
    /* Hide the button */
  }

  #result {
    margin-top: 20px;
    font-weight: bold;
    font-size: 18px;
  }

  #investmentPie,
  #investmentChart,
  #annualChart {
    margin-top: 20px;
  }
</style>
<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>

<label for="years">Years:</label>
<select id="years" onchange="calculateFutureValue()">
  <option value="1">1</option>
  <option value="2">2</option>
  <option value="3">3</option>
  <option value="4">4</option>
  <option value="5">5</option>
  <option value="10">10</option>
  <option value="15">15</option>
  <option value="20" selected="selected" >20</option>
  <option value="25">25</option>
  <option value="30">30</option>
  <option value="35">35</option>
  <option value="40">40</option>
  <option value="50">50</option>
  <option value="60">60</option>
  <option value="70">70</option>
  <option value="80">80</option>
  <option value="90">90</option>
  <option value="100">100</option>
</select><br>

<label for="monthlyInvestment">Monthly Investment:</label>
<select id="monthlyInvestment" onchange="calculateFutureValue()">
  <option value="10">10</option>
  <option value="20">20</option>
  <option value="50">50</option>
  <option value="100" selected="selected" >100</option>
  <option value="200">200</option>
  <option value="500">500</option>
  <option value="1000">1000</option>
  <option value="2000">2000</option>
  <option value="5000">5000</option>
  <option value="10000">10000</option>
</select><br>

<label for="annualInterest">Annual Interest:</label>
<select id="annualInterest" onchange="calculateFutureValue()">
  <option value="0.0">0.0</option>
  <option value="0.5">0.5</option>
  <option value="1.0">1.0</option>
  <option value="1.5">1.5</option>
  <option value="2.0">2.0</option>
  <option value="2.5">2.5</option>
  <option value="3.0">3.0</option>
  <option value="3.5">3.5</option>
  <option value="4.0">4.0</option>
  <option value="4.5">4.5</option>
  <option value="5.0" selected="selected" >5.0</option>
  <option value="5.5">5.5</option>
  <option value="6.0">6.0</option>
  <option value="6.5">6.5</option>
  <option value="7.0">7.0</option>
  <option value="7.5">7.5</option>
  <option value="8.0">8.0</option>
  <option value="8.5">8.5</option>
  <option value="9.0">9.0</option>
  <option value="9.5">9.5</option>
  <option value="10.0">10.0</option>
  <option value="10.5">10.5</option>
</select><br>

<div id="result">
  <p id="futureValue" style="color: rgb(20, 133, 204);"></p>
  <p id="totalInvestment" style="color: rgb(204, 204, 204);"></p>
  <p id="profit" style="color: rgb(112, 173, 71);"></p>
</div>

<div id="investmentPie"></div>
<div id="investmentChart"></div>
<div id="annualChart"></div>

<script>
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

    document.getElementById('futureValue').innerText = 'Future Value: $' + futureValue.toFixed(2);
    document.getElementById('totalInvestment').innerText = 'Total Investment: $' + totalInvestment.toFixed(2);
    document.getElementById('profit').innerText = 'Profit: $' + (futureValue - totalInvestment).toFixed(2);

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
      name: 'Future Value',
      marker: {
        color: 'rgb(20, 133, 204)' // Apple-like blue
      }
    };

    var totalInvestmentTrace = {
      x: months,
      y: totalInvestments.slice(0, displayMonths),
      type: 'bar',
      name: 'Total Investment',
      marker: {
        color: 'rgb(204, 204, 204)' // Light gray
      }
    };

    var profitTrace = {
      x: months,
      y: profits.slice(0, displayMonths),
      type: 'bar',
      name: 'Profit',
      marker: {
        color: 'rgb(112, 173, 71)' // Apple-like green
      }
    };

    var layout = {
      xaxis: {
        title: xLabels === 'Months' ? 'Months' : 'Years',
        color: '#000',
        tickmode: 'array',
        tickvals: months,
        ticktext: months.map(m => (m % 12 === 0) ? Math.floor(m / 12) + ' Yr ' + (m % 12 || 12) + ' Mo' : ''),
        tickfont: {
          family: '-apple-system, BlinkMacSystemFont, Segoe UI, SegoeUI, "Helvetica Neue", Helvetica, Arial, sans-serif'
        }
      },
      yaxis: {
        title: 'Amount ($)',
        color: '#000',
        tickfont: {
          family: '-apple-system, BlinkMacSystemFont, Segoe UI, SegoeUI, "Helvetica Neue", Helvetica, Arial, sans-serif'
        }
      },
      title: title,
      paper_bgcolor: '#FFF',
      plot_bgcolor: '#FFF',
      font: {
        family: '-apple-system, BlinkMacSystemFont, Segoe UI, SegoeUI, "Helvetica Neue", Helvetica, Arial, sans-serif'
      }
    };

    Plotly.newPlot(chartId, [valueTrace, totalInvestmentTrace, profitTrace], layout);
  }

  function drawPieChart(totalInvestment, profit) {
    var pieData = [{
      labels: ['Total Investment', 'Profit'],
      values: [totalInvestment, profit],
      type: 'pie',
      marker: {
        colors: ['rgb(204, 204, 204)', 'rgb(112, 173, 71)'] // Light gray and Apple-like green
      }
    }];

    var pieLayout = {
      title: 'Investment Distribution',
      paper_bgcolor: '#FFF',
      plot_bgcolor: '#FFF',
      font: {
        family: '-apple-system, BlinkMacSystemFont, Segoe UI, SegoeUI, "Helvetica Neue", Helvetica, Arial, sans-serif'
      }
    };

    Plotly.newPlot('investmentPie', pieData, pieLayout);
  }

  // Calculate and display histograms with initial values when the page is loaded
  window.onload = calculateFutureValue;
</script>
