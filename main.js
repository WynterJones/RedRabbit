const shell = require('electron').shell;
const url = require('url')
const path = require('path')
const { app, BrowserWindow, ipcMain } = require('electron')

let mainWindow = null
let childWindow = null


const mainUrl = url.format({
  protocol: 'file',
  slashes: true,
  pathname: path.join(__dirname, 'app/index.html')
})

app.on('ready', function () {

  mainWindow = new BrowserWindow({
    center: true,
    fullscreen: false,
    width: 1100,
    height: 1100,
    minWidth: 960,
    minHeight: 850,
    fullscreen: false,
    show: false,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadURL(mainUrl)

  mainWindow.webContents.on('dom-ready', function () {
    mainWindow.show();
    mainWindow.focus();
  })
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
    app.quit()
  })

  childWindow = new BrowserWindow({
      parent: mainWindow,
      show: false,
      width: 600,
      height: 600,
      webPreferences: {
        nodeIntegration: false,
        preload: path.join(__dirname, 'app/js/preload.js')
      }
  })

  childWindow.on('closed', function () {
    mainWindow = null
    app.quit()
  })

  childWindow.webContents.on('dom-ready', function () {
    childWindow.send('sendbackhtml')
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') { app.exit() }
})

ipcMain.on('scrapeurl', (event, url, id) => {
  childWindow.loadURL(url, { userAgent: 'RedRabbit' })
})

ipcMain.on('hereishtml', (event, data) => {
  mainWindow.send('extracthtml', data)
})
