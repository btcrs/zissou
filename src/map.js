var L = require('leaflet');
require('esri-leaflet');
var E = require('../electron');
const remote = require('electron').remote;
const BrowserWindow = remote.BrowserWindow;
L.Icon.Default.imagePath = '../../node_modules/leaflet/dist/images';

var dataMap = L.map('map', {zoomControl:false}).setView([27.28, -82.48], 12);
new L.Control.Zoom({ position: 'bottomleft' }).addTo(dataMap);

L.marker([27.28, -82.48]).addTo(dataMap)
.on("click", function (event) {
  var graphWindow = new BrowserWindow({
    'title': "Loggers",
    'width': 520,
    'height': 305,
    'titleBarStyle': 'hidden-inset',
    'backgroundColor': '#525252',
    'show': false,
  })

  graphWindow.loadURL('file://' + __dirname + '/graph.html');
  graphWindow.once('ready-to-show', function() {
    graphWindow.show()
  })
});

var markersLayer = L.esri.basemapLayer('DarkGray').addTo(dataMap)


