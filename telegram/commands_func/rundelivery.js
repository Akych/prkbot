
const {telegramm} = require("../../cfg.json")
const delivery = require("../modules/updatedilivery.js")
module.exports = {
    func:async (ctx)=>{
        const userid = ctx.update.callback_query.from.id
        if(!telegramm.admins[userid]) return
        delivery.start()
    }
}