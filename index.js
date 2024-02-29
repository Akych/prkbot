const loader = require("./downloader/downloader.js")
const initalizepaths = require("./helpers/initalizefiles.js")
const exceleditor = require("./modules/exceleditor.js")
const tempcleaner = require("./helpers/tempcleaner.js")
const delivery = require("./telegram/modules/updatedilivery.js")
const db = require("./database/db.js")

//const settings = require("./settings.js")

// выполнить при запуске
loader.run().then(async ()=>{
    await exceleditor.run()
    const telegram = require("./telegram/main.js")
    const tv = require("./tv/express.js")
})

//Выполнить при обнаружении нового расписания
loader.idle(async ()=>{
    loader.run().then(async ()=>{
        await tempcleaner.run()
        await exceleditor.run()
        await delivery.start()
    })
})



