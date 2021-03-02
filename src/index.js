const { ipcRenderer } = require('electron')
const { read } = require('fs')
const readXlsxFile = require('read-excel-file/node');


populateList()
const openBtn = document.getElementById('openBtn')
const addBtn = document.getElementById('addBtn')
const checkBox = document.getElementById('checkBox')
const ptDropDown = document.getElementById('printingType')
const createBtn = document.getElementById('createBtn')
const chooseBtn = document.getElementById('select-file')
const importBtn = document.getElementById('import')

var productCodes = [] //List of product codes imported from the excel file

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
    var subProgram = checkBox.checked
    var printingType = ptDropDown.value
    if (productCode == "") {
        ipcRenderer.send('empty', "Product code field cannot be empty")
    } else if (ptDropDown.value == "") {
        ipcRenderer.send('empty', "Select printing type")
    } else {
        fillTable(productCode, subProgram, printingType)
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
        document.getElementById('newPc').value = ""
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
    if (!path['canceled']) {
        document.getElementById('file-path').value = filePath
    }
    readXlsxFile(filePath).then((rows) => {
        // `rows` is an array of rows
        // each row being an array of cells.
        //console.log(rows)
        productCodes = rows
    })
})

importBtn.addEventListener('click', () => {
    var subProgram
    for (let i = 1; i < productCodes.length; i++) {
        if (productCodes[i][2] == "Yes") {
            subProgram = true
        } else {
            subProgram = false
        }
        fillTable(productCodes[i][0], subProgram, productCodes[i][1])
    }
})

function fillTable(productCode, subProgram, printingType) {
    var newPcTable = document.getElementById('newPcTable')
    var tbody = newPcTable.children[1]
    var row = document.createElement('tr')
    var tdProductCode = document.createElement('td')
    var tdProgram = document.createElement('td')
    var tdSubProgram = document.createElement('td')
    var tdPrintingType = document.createElement('td')
    tdProductCode.innerHTML = productCode.toUpperCase().trim()
    tdProgram.innerHTML = productCode.substring(0, 2).toUpperCase().trim()
    tdPrintingType.innerHTML = printingType
    if (subProgram) {
        tdSubProgram.innerHTML = productCode.substring(2, 4).toUpperCase().trim()
    } else {
        tdSubProgram.innerHTML = "None"
    }
    row.appendChild(tdProductCode)
    row.appendChild(tdProgram)
    row.appendChild(tdSubProgram)
    row.appendChild(tdPrintingType)
    tbody.appendChild(row)
}