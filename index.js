const loader = require("./downloader/downloader.js")
const initalizepaths = require("./helpers/initalizefiles.js")
const exceleditor = require("./modules/exceleditor.js")
const tempcleaner = require("./helpers/tempcleaner.js")

// выполнить при запуске
loader.run().then(async ()=>{
    await exceleditor.run()
    const telegramm = require("./telegram/main.js")
})

//Выполнить при обнаружении нового расписания
loader.idle(async ()=>{
    loader.run().then(async ()=>{
        await tempcleaner.run()
        await exceleditor.run()
    })
})



