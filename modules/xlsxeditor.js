const ExcelJS = require('exceljs');
const sourceSheetName = 'Очное';
const targetSheetName = 'Очное';


//helper functions
const adresformater = require("./helpres/xlsxadressformater.js")
const numberToAddress = adresformater.numberToAddress
const addressToNumber = adresformater.addressToNumber
 
//("./files/schedule.xlsx",'./temp/test.xlsx',["A6","AG45"],["A1"])
module.exports.cut = async (pathtoschedule,targetFilePath,range,startRange = undefined)=>{

  const sourceWorkbook = new ExcelJS.Workbook();
  const targetWorkbook = new ExcelJS.Workbook();
  
  return new Promise((resolve, reject) => {
    Promise.all([
      sourceWorkbook.xlsx.readFile(pathtoschedule),
      targetWorkbook.xlsx.writeFile(targetFilePath)
  ])
  .then(() => {
      const sourceSheet = sourceWorkbook.getWorksheet(sourceSheetName);
  
      let targetSheet = targetWorkbook.getWorksheet(targetSheetName);
      if (!targetSheet) {
          targetSheet = targetWorkbook.addWorksheet(targetSheetName);
      }
  
      const offset = startRange ? addressToNumber(startRange[0]) : {col:0,row:0} 

      const point1Data = addressToNumber(range[0])
      const point2Data = addressToNumber(range[1])
  
      const rowRange = {min:point1Data.row,max:point2Data.row}
      const colRange = {min:point1Data.col,max:point2Data.col}
  
      const excelranges = {}
      for (let rowNumber = rowRange.min; rowNumber <= rowRange.max; rowNumber++) {
        for (let colNumber = colRange.min; colNumber <= colRange.max; colNumber++) {
  
            const sourceRow = sourceSheet.getRow(rowNumber);
            const sourceCell = sourceRow.getCell(colNumber);
  
            let targetrowRange = rowNumber - (rowRange.min-1) + (offset.row)
            let targetcolRange = colNumber - (colRange.min-1) + (offset.col)
  
            if (sourceCell.master !== sourceCell){
              var mastercolrow = addressToNumber(sourceCell.master.address)
              var curcolrow = addressToNumber(sourceCell.address)
              mastercolrow.row -= rowRange.min-1
              mastercolrow.col -= colRange.min-1
              curcolrow.row -= rowRange.min-1
              curcolrow.col -= colRange.min-1
              excelranges[numberToAddress(mastercolrow.row,mastercolrow.col)] = numberToAddress(curcolrow.row,curcolrow.col)
            }
  
            const targetRow = targetSheet.getRow(targetrowRange);
            const targetCell = targetRow.getCell(targetcolRange);
  
            targetCell.value = sourceCell.value;
            targetCell.numFmt = sourceCell.numFmt;
            targetCell.alignment = Object.assign({}, sourceCell.alignment);
            targetCell.font = Object.assign({}, sourceCell.font);
            targetCell.fill = Object.assign({}, sourceCell.fill);
            targetCell.border = Object.assign({}, sourceCell.border);
  
  
            targetRow.height = sourceRow.height;
            targetSheet.getColumn(targetcolRange).width = sourceSheet.getColumn(colNumber).width;
        
        }
      }
  
      for (const targetCellAddress in excelranges) {
          if (excelranges.hasOwnProperty(targetCellAddress)) {
              const sourceCellAddress = excelranges[targetCellAddress];

              const sourceCellAddressData = addressToNumber(sourceCellAddress)
              const targetCellAddressData = addressToNumber(targetCellAddress)

              sourceCellAddressData.row+=offset.row
              sourceCellAddressData.col+=offset.col

              targetCellAddressData.row+=offset.row
              targetCellAddressData.col+=offset.col
              //numberToAddress(sourceCellAddressData.row,sourceCellAddressData.col)
              //numberToAddress(targetCellAddressData.row,targetCellAddressData.col)
              targetSheet.mergeCells(`${numberToAddress(sourceCellAddressData.row,sourceCellAddressData.col)}:${numberToAddress(targetCellAddressData.row,targetCellAddressData.col)}`);

          }
      }
      //console.log(excelranges)
      // Сохраняем изменения в целевом файле
      return targetWorkbook.xlsx.writeFile(targetFilePath);
  })
  .then(() => {
      resolve(targetFilePath)
  })
  .catch((error) => {
      reject(error)
  });
  
  })

}

module.exports.merge = async (pathtoschedule,targetFilePath,range,startRange = undefined)=>{

  const sourceWorkbook = new ExcelJS.Workbook();
  const targetWorkbook = new ExcelJS.Workbook();
  
  return new Promise((resolve, reject) => {
    Promise.all([
      sourceWorkbook.xlsx.readFile(pathtoschedule),
      targetWorkbook.xlsx.readFile(targetFilePath)
  ])
  .then(() => {
      const sourceSheet = sourceWorkbook.getWorksheet(sourceSheetName);
  
      let targetSheet = targetWorkbook.getWorksheet(targetSheetName);
      if (!targetSheet) {
          targetSheet = targetWorkbook.addWorksheet(targetSheetName);
      }
  

      const offset = startRange ? addressToNumber(startRange[0]) : {col:0,row:0} 

      const point1Data = addressToNumber(range[0])
      const point2Data = addressToNumber(range[1])
  
      const rowRange = {min:point1Data.row,max:point2Data.row}
      const colRange = {min:point1Data.col,max:point2Data.col}
  
      const excelranges = {}
      for (let rowNumber = rowRange.min; rowNumber <= rowRange.max; rowNumber++) {
        for (let colNumber = colRange.min; colNumber <= colRange.max; colNumber++) {
  
            const sourceRow = sourceSheet.getRow(rowNumber);
            const sourceCell = sourceRow.getCell(colNumber);
  
            let targetrowRange = rowNumber - (rowRange.min-1) + (offset.row-1)
            let targetcolRange = colNumber - (colRange.min-1) + (offset.col)
  
            if (sourceCell.master !== sourceCell){
              var mastercolrow = addressToNumber(sourceCell.master.address)
              var curcolrow = addressToNumber(sourceCell.address)
              mastercolrow.row -= rowRange.min-1
              mastercolrow.col -= colRange.min-1
              curcolrow.row -= rowRange.min-1
              curcolrow.col -= colRange.min-1
              excelranges[numberToAddress(mastercolrow.row,mastercolrow.col)] = numberToAddress(curcolrow.row,curcolrow.col)
            }
  
            const targetRow = targetSheet.getRow(targetrowRange);
            const targetCell = targetRow.getCell(targetcolRange);
  
            targetCell.value = sourceCell.value;
            targetCell.numFmt = sourceCell.numFmt;
            targetCell.alignment = Object.assign({}, sourceCell.alignment);
            targetCell.font = Object.assign({}, sourceCell.font);
            targetCell.fill = Object.assign({}, sourceCell.fill);
            targetCell.border = Object.assign({}, sourceCell.border);
  
  
            targetRow.height = sourceRow.height;
            targetSheet.getColumn(targetcolRange).width = sourceSheet.getColumn(colNumber).width;
        
        }
      }
      //console.log(excelranges)
      for (const targetCellAddress in excelranges) {
          if (excelranges.hasOwnProperty(targetCellAddress)) {
              const sourceCellAddress = excelranges[targetCellAddress];
              
              const sourceCellAddressData = addressToNumber(sourceCellAddress)
              const targetCellAddressData = addressToNumber(targetCellAddress)

              sourceCellAddressData.row+=offset.row-1
              sourceCellAddressData.col+=offset.col

              targetCellAddressData.row+=offset.row-1
              targetCellAddressData.col+=offset.col
              //numberToAddress(sourceCellAddressData.row,sourceCellAddressData.col)
              //numberToAddress(targetCellAddressData.row,targetCellAddressData.col)
              targetSheet.mergeCells(`${numberToAddress(sourceCellAddressData.row,sourceCellAddressData.col)}:${numberToAddress(targetCellAddressData.row,targetCellAddressData.col)}`);

          }
      }
      //console.log(excelranges)
      // Сохраняем изменения в целевом файле
      return targetWorkbook.xlsx.writeFile(targetFilePath);
  })
  .then(() => {
      resolve(targetFilePath)
  })
  .catch((error) => {
      reject(error)
  });
  
  })

}
