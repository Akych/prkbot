const ExcelJS = require('exceljs');
const initalizefiles = require("../helpers/initalizefiles.js")
const excel2html = require("./exceltohtml.js")
const html2image = require("./htmltoimage.js")
const getimagebyname = require("./getimagebyname.js")
const excelParser = require("./excelparser.js")
const storage = require("../helpers/globaldata.js")


const adresformater = require("../helpers/xlsxadressformater.js")
const numberToAddress = adresformater.numberToAddress
const addressToNumber = adresformater.addressToNumber
const addToStringAddress = adresformater.addToStringAddress
const SheetName = 'Очное';

module.exports.run = async ()=>{
    storage.init("groups_cache")
    storage.init("people_cache")
    storage.init("groups")
    storage.init("people")


    const mainWorkBook = new ExcelJS.Workbook();
    console.log("Загружаем основную таблицу")

    mainWorkBook.xlsx.readFile("./files/schedule.xlsx").then(async (data)=>{
        console.log("Основная таблица загружена")
        var startgenerator = new Date().getTime() / 1000;

        const schedule = new excelParser(mainWorkBook,SheetName)
        const sourceSheet = schedule.getSourceSheet()
        const lastRow = sourceSheet.lastRow.number;
        const lastColumn = sourceSheet.lastColumn.number;
        const lastColumAdress = numberToAddress(7,lastColumn)
        const downrightboxpoint = numberToAddress(lastRow,lastColumn)
        const tableadress = ["A7",lastColumAdress]

        await schedule.scanRange(tableadress,async (row,col)=>{
            if(col.master == col && col.value && col.value !== "Группа"){
                value = ""+col.value
                if (!storage.get("groups_cache")[value]){
                    storage.get("groups_cache")[value] = true
                    storage.add("groups",col.value)
                    //console.log(col.value)
                }
            }
        })

        const peopleranges = {}
        await schedule.scanRange(["A7",downrightboxpoint],async (row,col)=>{
            if(col.master == col && col.value){
                var value = ""+col.value
                const name = value.match(/^([А-яЁё]+\s\W\.\W\.$)/i);
                if(name&&name[1]){

                    //value = value.replace(/[ .]/g, '-');
                    //value = value + "test"
                    const savepath = "./files/temp/people/"+ value
                    if (!storage.get("people_cache")[value]){
                        storage.get("people_cache")[value] = true
                        storage.add("people",value)
                        initalizefiles.createpath(savepath)
                    }
                    if (!peopleranges[value]) peopleranges[value] = []
                    peopleranges[value].push(col.address)
                }
            }
        })

    for (const value in peopleranges) {
        const savepath = "./files/temp/people/"+ value

            var prev_item_address = 0
            var ceil_offset = 0

        var peoplemaket = await schedule.createExcel()
        await schedule.copyRange2Address(["A9","C117"])
        await schedule.copyRange2Address(["D9","E117"],["C0"])
        await schedule.cleanTargetStyles(["D2","E117"])

        schedule.getTargetSheet().getColumn(2).width = 5;


        if (peopleranges.hasOwnProperty(value)) {
            const array = peopleranges[value];

            for (let i = 0; i < array.length; i++) {
            const address = array[i];
            //console.log(` ${address}`);
            var name_address = addressToNumber(address)
            var room_address = {row:name_address.row,col:name_address.col+1}
            room_address = numberToAddress(room_address.row, room_address.col)

            var item_address = sourceSheet.getRow(name_address.row-1).getCell(name_address.col).master.address;
            var cell = sourceSheet.getRow(name_address.row).getCell(name_address.col)
            var groupname = sourceSheet.getRow(7).getCell(name_address.col).master.value
            var oldval = cell.master.value
            var oldalignment = cell.master.alignment

            cell.master.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
            cell.master.value = groupname

            var pastepos = addressToNumber(item_address)
            pastepos.row-=9
            
            // retard solution, its WORK!!!
            if(prev_item_address == pastepos.row){
                ceil_offset+=2
                await schedule.copyRange2Address(["D9","E117"],[addToStringAddress("C0",[0,ceil_offset])],{unmerge:true})
                await schedule.cleanTargetStyles([
                    addToStringAddress("D2",[0,ceil_offset]),
                    addToStringAddress("E117",[0,ceil_offset]),
                ])
            }else{
                ceil_offset = 0
                prev_item_address = 0
            }
            
            prev_item_address = pastepos.row
            pastepos.col = 3 + ceil_offset

            pastepos = numberToAddress(pastepos.row, pastepos.col)
            await schedule.copyRange2Address([item_address,room_address],[pastepos],{unmerge:true})

            cell.master.alignment = oldalignment
            cell.master.value = oldval
            cell.alignment = oldalignment

            }
        }

        var peoplemakettable = new excelParser(peoplemaket,SheetName)
        const _sourceSheet = peoplemaket.getWorksheet("Очное")
        const _lastRow = _sourceSheet.lastRow.number;
        const _lastColumn = _sourceSheet.lastColumn.number;

        const validates = {}
        for (let rowNumber = 0; rowNumber <= _lastRow; rowNumber++) {
            const sourceRow = _sourceSheet.getRow(rowNumber);
            const sourceCell = sourceRow.getCell(1);
            var _value = ""+sourceCell.value
            const date = _value.match(/(\W+)\s(\d+\.\d+\.\d+)/i);
            if(date){
                if(!validates[date[1]]) validates[date[1]] = {start:numberToAddress(rowNumber,1),end:numberToAddress(rowNumber,_lastColumn)}
                validates[date[1]].end = numberToAddress(rowNumber,_lastColumn)
            }
        }

        const ranges = Object.entries(validates).map(([day, times]) => [day, {start:times.start, end:times.end}]);
        ranges[0][1].start = "A1" // save title

        var range1 = ranges[0][1].start
        var range2 = ranges[1][1].end

        await peoplemakettable.createExcel()
        await peoplemakettable.copyRange2Address([range1,range2])
        await peoplemakettable.saveExcel(savepath+"/1.xlsx")

        var range1 = ranges[2][1].start
        var range2 = ranges[3][1].end
        await peoplemakettable.createExcel()
        await peoplemakettable.copyRange2Address([range1,range2])
        await peoplemakettable.saveExcel(savepath+"/2.xlsx")

        var range1 = ranges[4][1].start
        var range2 = ranges[5][1].end
        await peoplemakettable.createExcel()
        await peoplemakettable.copyRange2Address([range1,range2])
        await peoplemakettable.saveExcel(savepath+"/3.xlsx")

        }

        storage.clean("people_cache")
        storage.clean("groups_cache")
        storage.sort("people")

        await schedule.scanRange(tableadress,async (row,col)=>{
            if(col.master == col && col.value && col.value !== "Группа"){
                try {
                    const startadress = addressToNumber(col.master.address)
                    var groupExcel = await schedule.createExcel()
                    await schedule.copyRange2Address(["A7","C117"]) // here time table
                    await schedule.copyRange2Address([numberToAddress(startadress.row,startadress.col),numberToAddress(lastRow,startadress.col + 1)],["C0"])
                    var groupTable = new excelParser(groupExcel,SheetName)
                    const _sourceSheet = groupExcel.getWorksheet("Очное")
                    const _lastRow = _sourceSheet.lastRow.number;
                    const _lastColumn = _sourceSheet.lastColumn.number;

                    const validates = {}
                    for (let rowNumber = 0; rowNumber <= _lastRow; rowNumber++) {
                        const sourceRow = _sourceSheet.getRow(rowNumber);
                        const sourceCell = sourceRow.getCell(1);
                        var value = ""+sourceCell.value
                        const date = value.match(/(\W+)\s(\d+\.\d+\.\d+)/i);
                        if(date){
                            if(!validates[date[1]]) validates[date[1]] = {start:numberToAddress(rowNumber,1),end:numberToAddress(rowNumber,_lastColumn)}
                            validates[date[1]].end = numberToAddress(rowNumber,_lastColumn)
                        }
                    }

                    const ranges = Object.entries(validates).map(([day, times]) => [day, {start:times.start, end:times.end}]);
                    ranges[0][1].start = "A1" // save title
                    const savepath = "./files/temp/groups/"+ col.value
                    initalizefiles.createpath(savepath)

                    var range1 = ranges[0][1].start
                    var range2 = ranges[1][1].end

                    await groupTable.createExcel()
                    await groupTable.copyRange2Address([range1,range2])
                    await groupTable.saveExcel(savepath+"/1.xlsx")

                    var range1 = ranges[2][1].start
                    var range2 = ranges[3][1].end
                    await groupTable.createExcel()
                    await groupTable.copyRange2Address([range1,range2])
                    await groupTable.saveExcel(savepath+"/2.xlsx")

                    var range1 = ranges[4][1].start
                    var range2 = ranges[5][1].end
                    await groupTable.createExcel()
                    await groupTable.copyRange2Address([range1,range2])
                    await groupTable.saveExcel(savepath+"/3.xlsx")
                    //console.log("Генерация завершена: ",col.value, ( (new Date().getTime() / 1000) - startgenerator),"sec")
                } catch (error) {
                    console.log(error)
                }
            }
        })


        console.log("Генерация Excel завершена ",new Date().getTime() / 1000 - startgenerator,"sec")
        //await schedule.newExcel()
        //schedule.copyRange2Address(["A7","C12"],["A1"])
        //schedule.copyRange2Address(["A7","C12"],["D1"])
        //await schedule.saveExcel("./files/temp/test.xlsx")
    })
}

