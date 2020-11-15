const { ipcRenderer } = require('electron')


populateList()
const openBtn = document.getElementById('openBtn')
const addBtn = document.getElementById('addBtn')
const checkBox = document.getElementById('checkBox')
const ptDropDown = document.getElementById('printingType')

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
    if (productCode == "") {
        ipcRenderer.send('pc-empty', true)
    } else if (ptDropDown.value == "") {
        ipcRenderer.send('printingType-empty', true)
    } else {
        var newPcTable = document.getElementById('newPcTable')
        //var thead = newPcTable.children[0]
        var tbody = newPcTable.children[1]
        // if (thead.children.length == 0) {
        //     var headers = ["Product Code", "Program", "Sub Program", "Printing Type"]
        //     var row = document.createElement('tr')
        //     for (let i = 0; i < headers.length; i++) {
        //         var cell = document.createElement('th')
        //         cell.innerHTML = headers[i]
        //         row.appendChild(cell)
        //     }
        //     thead.appendChild(row)
        // }
        var row = document.createElement('tr')
        var tdProductCode = document.createElement('td')
        var tdProgram = document.createElement('td')
        var tdSubProgram = document.createElement('td')
        var tdPrintingType = document.createElement('td')
        tdProductCode.innerHTML = productCode.toUpperCase().trim()
        tdProgram.innerHTML = productCode.substring(0,2).trim()
        tdPrintingType.innerHTML = ptDropDown.value
        if (checkBox.checked) {
            tdSubProgram.innerHTML = productCode.substring(2,4).trim()
        } else {
            tdSubProgram.innerHTML = "None"
        }
        row.appendChild(tdProductCode)
        row.appendChild(tdProgram)
        row.appendChild(tdSubProgram)
        row.appendChild(tdPrintingType)
        tbody.appendChild(row)
        //console.log(tbody)
    }
})