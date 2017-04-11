const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const app = electron.app;
const Menu = electron.Menu;
const Tray = electron.Tray;
const ipc = electron.ipcMain;

var alertWindows = {};
var alertRevision = {};
var electronReady = false;

exports.BrowserWindow = BrowserWindow;
exports.app = app;
exports.Menu = Menu;
exports.Tray = Tray;
exports.ipc = ipc;
exports.alertWindows = alertWindows;
exports.alertRevision = alertRevision;
exports.electronReady = electronReady;

exports.newAbout = (data) => {
    var aboutWindow = new BrowserWindow({
        'title': "Loggers",
        'width': 330,
        'height': 200,
        'resizable': false,
        'fullscreen': false,
        'autoHideMenuBar': true,
        'skipTaskbar': false
    });

    if (process.platform === 'darwin') app.dock.show();
    aboutWindow.focus();
    aboutWindow.loadURL('file://' + __dirname + '/windows/about.html');
    aboutWindow.on('closed', () => { });
};

exports.newWindow = (data) => {
  var graphWindow = new BrowserWindow({
    'title': "Loggers",
    'width': 520,
    'height': 350,
    'titleBarStyle': 'hidden-inset',
    'backgroundColor': "#111",
  })

  graphWindow.loadURL('file://' + __dirname + '/windows/graph.html');
};

exports.newSettings = () => {
    var settingsWindow = new BrowserWindow({
        'title': "Settings",
        'width': 400,
        'height': 250,
        'resizable': false,
        'fullscreen': false,
        'autoHideMenuBar': true,
        'skipTaskbar': false
    });

    if (process.platform === 'darwin') app.dock.show();
    settingsWindow.loadURL('file://' + __dirname + '/windows/settings.html');
};
