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

ipcMain.on('pc-empty', function(event, arg) {
  dialog.showMessageBox({
    type: "warning",
    title: "Empty Field",
    message: "Product Code field cannot be empty"
  })
})

ipcMain.on('pc-not-found', function(event, arg) {
  dialog.showErrorBox("Not Found", "Product Code not found")
})