$(function() {
  var http = require('http')
  var titlebar = require('titlebar');
  var t = titlebar();
  var fs = require('fs');

  t.appendTo(document.body);
  t.on('close', function(e) {
    console.log('close');
  });
  t.element.appendChild(document.createElement('div'));
  t.destroy();

  var dates = []
  var values = [ [], [] ]
  var dataSlice = [ [], [] ]
  var labelSlice = []

  server = http.createServer(function(req, res) {
    if (req.method == 'POST') {
      var body = '';
      req.on('data', function(data) {
        body += data;
      });
      req.on('end', function() {
        obj = (JSON.parse(body));
        var measure = {
          "Value": obj['Sensors']['MCP9808']['Ambient_Temperature'],
          "Date": obj['System']['Date'] + " " + obj['System']['Time']
        }
        dataSlice[0].shift()
        dataSlice[1].shift()
        labelSlice.shift()
        dataSlice[0].push(measure["Value"] * 9 / 5 + 32);
        dataSlice[1].push(measure["Value"]);
        labelSlice.push(formatDate(new Date(measure['Date'])));
        values[0].push(parseFloat(obj['Sensors']['MCP9808']['Ambient_Temperature']) * 9 / 5 + 32);
        values[1].push(parseFloat(obj['Sensors']['MCP9808']['Ambient_Temperature']));
        dates.push(formatDate(new Date(measure['Date'])));
        chart.update()
        fs.appendFile('data/temperature.txt', JSON.stringify(measure) + "\n", function(err) {
          if (err) throw err;
          console.log('Saved!');
        });

      });
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.end('post received');
    }
  });

  port = 5000;
  host = '0.0.0.0';
  server.listen(port, host);
  console.log('Listening at http://' + host + ':' + port);

  function formatDate(date) {
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    var hours = date.getHours();
    var minutes = date.getMinutes();

    return hours + ':' + minutes;
  }

  var lines = require('fs').readFileSync("data/temperature.txt", 'utf-8')
    .split('\n')
    .filter(Boolean)
    .map(function(item) {
      var obj = JSON.parse(item)
      values[0].push(parseFloat(obj['Value']) * 9 / 5 + 32);
      values[1].push(parseFloat(obj['Value']));
      dates.push(formatDate(new Date(obj['Date'])));
      return JSON.parse(item)
    })

  labelSlice = dates
  dataSlice = values

  var data = {
    labels: labelSlice,
    datasets: [{
      backgroundColor: 'rgba(255, 99, 132,.2)',
      label: "Fahrenheit",
      radius: 0,
      data: dataSlice[0],
    }, {
      backgroundColor: 'rgba(201, 203, 207,.2)',
      label: "Celcius",
      radius: 0,
      data: dataSlice[1],
    }]
  };

  document.querySelector('#dot').addEventListener('click', function() {
    updateChart(-20)
  })
  document.querySelector('#dotdot').addEventListener('click', function() {
    updateChart(-50)
  })
  document.querySelector('#dotdotdot').addEventListener('click', function() {
    updateChart(-100)
  })
  document.querySelector('#bigdot').addEventListener('click', function() {
    updateChart(false)
  })

  var timeFormat = 'HH:mm';

  var chart = new Chart($('.chart'), {
    type: 'line',
    data: data,
    responsive: true,
    maintainAspectRatio: false,
    options: {
        scales: {
            xAxes: [{
                display: false
            }]
        }
    },
  })

  var updateChart = function(portion) {
    if (portion !== false) {
      labelSlice = dates.slice((dates.length - 1) + portion)
      dataSlice = [ [], [] ]
      dataSlice[0] = values[0].slice((values[0].length - 1) + portion)
      dataSlice[1] = values[1].slice((values[1].length - 1) + portion)
    } else {
      labelSlice = dates
      dataSlice = [values[0], values[1]]
    }

    $('.chart').remove();
    $('#chart-container').append('<canvas class="chart"><canvas>');

    var data = {
      labels: labelSlice,
      datasets: [{
        backgroundColor: 'rgba(255, 99, 132,.2)',
        label: "Fahrenheit",
        radius: 0,
        data: dataSlice[0],
      }, {
        backgroundColor: 'rgba(201, 203, 207,.2)',
        label: "Celcius",
        radius: 0,
        data: dataSlice[1],
      }]
    };

    chart = new Chart($('.chart'), {
      type: 'line',
      data: data,
      responsive: true,
      maintainAspectRatio: false,
    options: {
        scales: {
            xAxes: [{
                display: false
            }]
        }
    },
    })
  }
})
