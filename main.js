const { app, BrowserWindow, ipcMain, dialog } = require('electron')

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })

  // and load the index.html of the app.
  win.loadFile('src/index.html')
}

app.whenReady().then(createWindow)

ipcMain.on('empty', function(event, arg) {
  dialog.showMessageBox({
    type: "warning",
    title: "Empty Field",
    message: arg
  })
})

ipcMain.on('success', function(event, arg) {
  dialog.showMessageBox({
    type: "info",
    title: "success",
    message: arg
  })
})

ipcMain.on('error', function(event, arg) {
  dialog.showErrorBox("Not Found", arg)
})

ipcMain.on('open-file-dialog', function(event) {
  dialog.showOpenDialog({
    properties: ['openFile']
  }, function(files) {
    //console.log('Enter')
    if (files) {
      //console.log('Enter')
      event.sender.send('selected-file', files)
    }
  })
})