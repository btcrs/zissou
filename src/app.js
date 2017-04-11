var electron = require('electron')
var ipc = require('electron').ipcMain;
var path = require('path')
var url = require('url')
var fs = require('fs')
const e = require('./electron');

var window = null
var settingsPath = path.join(__dirname, 'settings.json');

if (!fs.existsSync(settingsPath)) {
    var settingsFile = {"first_run": true, "night_mode": false, "dev_mode": true };

    try {
            fs.writeFileSync(settingsPath, JSON.stringify(settingsFile));
        } catch (error) {}

    var settings = require('./settings.json');

} else {
    var settings = require('./settings.json');
}


var map = function(){
  window = new electron.BrowserWindow({
    width: 520,
    height: 520,
    titleBarStyle: 'hidden-inset',
    backgroundColor: "#111",
    show: false
  })

  window.loadURL(url.format({
    pathname: path.join(__dirname, '/windows/map.html'),
    protocol: 'file:',
    slashes: true
  }))

  window.once('ready-to-show', function() {
    window.show()
  })
}

electron.app.once('ready', function() {
  map()

  appTray = new electron.Tray('./resources/logo.png');
  appTray.setPressedImage('./resources/logoPressed.png');

  var menu = [
   { label: "Open", click: () => map()},
   { type: 'separator' },
   { label: "About", click: () => e.newAbout()},
   { type: 'separator' },
   { label: "Settings", click: () => e.newSettings()},
   { type: 'separator' },
   { label: "Quit", click: () => {
       electron.app.quit(); 
     }
   }
 ];

 contextMenu = electron.Menu.buildFromTemplate(menu);
 appTray.setToolTip('Loggers');
 appTray.setContextMenu(contextMenu);

})

electron.app.on('window-all-closed', () => {
    if (process.platform == 'darwin') electron.app.dock.hide();
    return;
});
