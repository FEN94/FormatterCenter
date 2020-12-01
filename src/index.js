const { ipcRenderer } = require('electron')


populateList()
const openBtn = document.getElementById('openBtn')
const addBtn = document.getElementById('addBtn')
const checkBox = document.getElementById('checkBox')
const ptDropDown = document.getElementById('printingType')
const createBtn = document.getElementById('createBtn')
const chooseBtn = document.getElementById('select-file')

openBtn.addEventListener('click', () => {
    var productCode = document.getElementById('pcInput').value
    if (productCode != "") {
        if (!openPcWindow(productCode.trim())) {
            ipcRenderer.send('error', "Product Code not found")
        }
    } else {
        ipcRenderer.send('empty', "Product code field empty")
    }
})

addBtn.addEventListener('click', () => {
    var productCode = document.getElementById('newPc').value
    if (productCode == "") {
        ipcRenderer.send('empty', "Product code field cannot be empty")
    } else if (ptDropDown.value == "") {
        ipcRenderer.send('empty', "Select printing type")
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
        tdProgram.innerHTML = productCode.substring(0, 2).toUpperCase().trim()
        tdPrintingType.innerHTML = ptDropDown.value
        if (checkBox.checked) {
            tdSubProgram.innerHTML = productCode.substring(2, 4).toUpperCase().trim()
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

createBtn.addEventListener('click', () => {
    var newPcTable = document.getElementById('newPcTable')
    var tbody = newPcTable.children[1]
    if (tbody.children.length == 0) {
        ipcRenderer.send('empty', "Table is empty")
    } else {
        var rows = tbody.children
        console.log(rows)
        for (let i = 0; i < rows.length; i++) {
            data = rows[i].children
            var productCode = data[0].innerHTML
            var program = data[1].innerHTML
            var subProgram = data[2].innerHTML
            var printingType = data[3].innerHTML
            createFolder(printingType, program, subProgram, productCode)
        }
        while (tbody.firstChild) {
            tbody.removeChild(tbody.lastChild)
        }
        populateList()
        ipcRenderer.send('success', "Folder(s) created successfully")
    }
})

chooseBtn.addEventListener('click', () => {
    ipcRenderer.send('open-file-dialog')
})

ipcRenderer.on('selected-file', function (event, path) {
    //do what you want with the path/file selected, for example:
    var filePath = path['filePaths'][0]
    console.log(path)
    if (!path['canceled']) {
        document.getElementById('file-path').innerHTML = filePath
    }
});