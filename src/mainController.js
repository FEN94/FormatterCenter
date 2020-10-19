const fs = require('fs')
const openExplorer = require('open-file-explorer')

// START TEST DATA ////
// var pcList = [
//     {
//         productCode: "MKAC001",
//         program: "MK",
//         subProgram: "",
//         printingType: ["Digital", "Offset"],
//         styles: 1,
//     },
//     {
//         productCode: "US29001",
//         program: "US",
//         subProgram: "29",
//         printingType: ["PFL"],
//         styles: 1,
//     },
//     {
//         productCode: "JRJR001",
//         program: "JR",
//         subProgram: "",
//         printingType: ["PFL"],
//         styles: 1,
//     }
// ]

// END TEST DATA ////

var pcList = []

function populateList() {
    var printingTypes = ["Arc_Thermal", "Digital", "Offset", "PFL"]
    var programs = [], subPrograms = [], productCodes = []
    // Search on every printing type folder
    printingTypes.forEach(function (printingType) {
        programs = fs.readdirSync("C:/GMC/" + printingType) //List of programs
        // Search every program folder
        programs.forEach(function (program) {
            productCodes = fs.readdirSync("C:/GMC/" + printingType + "/" + program) //List of product codes
            if (productCodes[0].length > 2) { //if the string is larger than 2, then is not a subProgram
                productCodes.forEach(function (productCode) {
                    var aux = inList(productCode) //looks if product code already is in the list
                    if (!aux[0]) { //if is not in the list then add it
                        addProductCode(productCode, program, "", printingType)
                    } else { //if is in the list, add the printing type to product code obj printing type list
                        aux[1]["printingType"].push(printingType)
                        pcList.splice(aux[2], 0, aux[1]) //Add product code obj back to list
                    }
                })
            } else { // the string correspond to a subProgram
                subPrograms = productCodes
                subPrograms.forEach(function (subProgram) {
                    productCodes = fs.readdirSync("C:/GMC/" + printingType + "/" + program + "/" + subProgram)
                    productCodes.forEach(function (productCode) {
                        var aux = inList(productCode) //looks if product code already is in the list
                        if (!aux[0]) { //if is not in the list then add it
                            addProductCode(productCode, program, subProgram, printingType)
                        } else { //if is in the list, add the printing type to product code obj printing type list
                            aux[1]["printingType"].push(printingType)
                            pcList.splice(aux[2], 0, aux[1]) //Add product code obj back to list
                        }
                    })
                })
            }
        })
    })
    console.log(pcList)
}

// LOOKS IF PRODUCT CODE ALREADY EXIST IN THE LIST
function inList(productCode) {
    var x = false
    var result = [] // [boolean, producCode object, object position]
    if (pcList.length != 0) {
        for (let i = 0; i < pcList.length; i++) {
            if (pcList[i]["productCode"] == productCode) {
                x = true
                result = [x, pcList[i], i] // [boolean, producCode object, object position]
                pcList.splice(i, 1) // Remove that product code obj from the list
            }
        }
    }
    return result
}

// ADD NEW PRODUCT CODE TO LIST
function addProductCode(productCode, program, subProgram, printingType) {
    var newPC = {
        productCode: productCode,
        program: program,
        subProgram: subProgram,
        printingType: [],
    }
    newPC["printingType"].push(printingType)
    pcList.push(newPC)
}

function openPcWindow (productCode) {
    var result = inList(productCode) // Search for product code on the list
    if (result[0]) {
        pcList.splice(result[2], 0, result[1]) //Add product code obj back to the list
        var pc = result[1]
        var printingType = pc["printingType"][0], program = pc["program"], subProgram = pc["subProgram"]
        var path = ""
        if (subProgram == "") {
            path = "C:\\GMC\\"+printingType+"\\"+program+"\\"+productCode
        } else {
            path = "C:\\GMC\\"+printingType+"\\"+program+"\\"+subProgram+"\\"+productCode
        }
        //Open product code folder
        openExplorer(path, function (err) {
            if (err) {
                console.log(err)
            }
        })
        //console.log(pcList)
        return true
    } else {
        //console.log(pcList)
        return false
    }
}

// WRITE FILE
// var data = JSON.stringify(pcList)
// fs.writeFile("./pclist.json", data, function (err) {
//     if (err) {
//         throw err
//     }
// })

// READ FILE
// var pclist
// function readFile() {
//     fs.readFile("./pclist.json", "utf-8", function (err, data) {
//         if (err) {
//             throw err
//         }

//         pclist = JSON.parse(data.toString())
//         //console.log(pclist)
//         return pclist
//     })
// }


//populateList()
//openPcWindow("US2900A")
//console.log(pcList)