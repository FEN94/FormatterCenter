const electron = require('electron')
const { ipcRenderer } = require('electron')
const BrowserWindow = electron.remote.BrowserWindow

populateList()
const openBtn = document.getElementById('open-button')

openBtn.addEventListener('click', function(event) {
    var productCode = document.getElementById('pcInput').value
    if (productCode != "") {
        if (!openPcWindow(productCode.trim())) {
            ipcRenderer.send('pc-not-found', true)
        }
    } else {
        ipcRenderer.send('pc-empty', true)
    }
})