const ExcelJS = require('exceljs');
const sourceWorkbook = new ExcelJS.Workbook();

const adresformater = require("./helpres/xlsxadressformater.js")
const numberToAddress = adresformater.numberToAddress
const addressToNumber = adresformater.addressToNumber

const cfg = require("../cfg.json");

const findInPoint = (sourceSheet)=>{
    const lastRow = sourceSheet.lastRow.number;
    //const lastColumn = sourceSheet.lastColumn.number;
    var returnvalue = {row:undefined,col:1}
    for (let rowNumber = 0; rowNumber <= lastRow; rowNumber++) {
        const sourceRow = sourceSheet.getRow(rowNumber);
        const sourceCell = sourceRow.getCell(1);
        let value = sourceCell.value
        if(value == "Группа"){
            returnvalue.row =  rowNumber
            break
        }
    }
    return returnvalue
}

var timeTable
const collectGroups = (sourceSheet,startrow)=>{
    const lastRow = sourceSheet.lastRow.number;
    const lastColumn = sourceSheet.lastColumn.number;
    var groups = []
    const sourceRow = sourceSheet.getRow(startrow);
    for (let colNumber = 1; colNumber <= lastColumn; colNumber++) {
        const sourceCell = sourceRow.getCell(colNumber);
        let value = sourceCell.value
        if(value && sourceCell.master === sourceCell){
            if(value === "Группа"){
                if (cfg.dynamicTimeTable){
                    timeTable = [numberToAddress(startrow,colNumber),numberToAddress(lastRow,colNumber+2)]
                    console.log("dyncamic adress:",timeTable)
                }else if(!timeTable){
                    timeTable = [numberToAddress(startrow,colNumber),numberToAddress(lastRow,colNumber+2)]
                    console.log("fixed adress:",timeTable)
                }
            }else{
                groups.push({
                    name:value,
                    address:[numberToAddress(startrow,colNumber),numberToAddress(lastRow,colNumber+1)],
                    timeTable:timeTable
                })
            }
        }
    }
    //console.log(groups)
    return groups
}


module.exports.getDaysRange = async (pathtoschedule)=>{
    return new Promise((resolve, reject) => {
        Promise.all([
            sourceWorkbook.xlsx.readFile(pathtoschedule),
        ])
        .then(() => {
            const sourceSheet = sourceWorkbook.getWorksheet("Очное");
            const lastRow = sourceSheet.lastRow.number;
            const lastColumn = sourceSheet.lastColumn.number;
            const validates = {}
            for (let rowNumber = 0; rowNumber <= lastRow; rowNumber++) {
                const sourceRow = sourceSheet.getRow(rowNumber);
                const sourceCell = sourceRow.getCell(1);
                var value = ""+sourceCell.value
                const date = value.match(/(\W+)\s(\d+\.\d+\.\d+)/i);
                if(date){
                    if(!validates[date[1]]) validates[date[1]] = {start:numberToAddress(rowNumber,1),end:numberToAddress(rowNumber,lastColumn)}
                    validates[date[1]].end = numberToAddress(rowNumber,lastColumn)
                }
            }
            const ranges = Object.entries(validates).map(([day, times]) => [day, {start:times.start, end:times.end}]);
            ranges[0][1].start = "A1" // save title
            resolve(ranges)
        })
    })
}

module.exports.getGroups = async (pathtoschedule)=>{
    return new Promise((resolve, reject) => {
        Promise.all([
            sourceWorkbook.xlsx.readFile(pathtoschedule),
        ])
        .then(() => {
            const sourceSheet = sourceWorkbook.getWorksheet("Очное");
            const startpoint = findInPoint(sourceSheet)
            resolve(collectGroups(sourceSheet,startpoint.row))
        })
    })
}

module.exports.getCoursesRange = async (pathtoschedule)=>{
    return new Promise((resolve, reject) => {
        Promise.all([
            sourceWorkbook.xlsx.readFile(pathtoschedule),
        ])
        .then(() => {
            const sourceSheet = sourceWorkbook.getWorksheet("Очное");
            const startpoint = findInPoint(sourceSheet)
            const sourceRow = sourceSheet.getRow(startpoint.row);
            const lastRow = sourceSheet.lastRow.number;
            const lastColumn = sourceSheet.lastColumn.number;
            var startcol = 1
            var ranges = []
            for (let colNumber = 3; colNumber <= lastColumn; colNumber++) {
                const sourceCell = sourceRow.getCell(colNumber);
                let value = sourceCell.value
                if(value && sourceCell.master === sourceCell){
                    if(value === "Группа"){
                        ranges.push({start:numberToAddress(6,startcol),end:numberToAddress(lastRow,colNumber-1)})
                        startcol = colNumber
                    }
                }
            }
            resolve(ranges)
        })
    })
}