const { ipcRenderer } = require('electron')


populateList()
const openBtn = document.getElementById('openBtn')
const addBtn = document.getElementById('addBtn')

openBtn.addEventListener('click', () => {
    var productCode = document.getElementById('pcInput').value
    if (productCode != "") {
        if (!openPcWindow(productCode.trim())) {
            ipcRenderer.send('pc-not-found', true)
        }
    } else {
        ipcRenderer.send('pc-empty', true)
    }
})

addBtn.addEventListener('click', () => {
    var productCode = document.getElementById('newPc').value
    if (productCode != "") {
        var newPcTable = document.getElementById('newPcTable')
        var thead = newPcTable.children[0]
        var tbody = newPcTable.children[1]
        if (thead.children.length == 0) {
            var headers = ["Product Code", "Program", "Sub Program", "Printing Type"]
            var row = document.createElement('tr')
            for (let i = 0; i < headers.length; i++) {
                var cell = document.createElement('th')
                cell.innerHTML = headers[i]
                row.appendChild(cell)
            }
            thead.appendChild(row)
        }
        var row = document.createElement('tr')
        var cell = document.createElement('td')
        cell.innerHTML = productCode.toUpperCase().trim()
        row.appendChild(cell)
        tbody.appendChild(row)
        //console.log(tbody)
    } else {
        ipcRenderer.send('pc-empty', true)
    }
})