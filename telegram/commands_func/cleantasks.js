

const {telegramm} = require("../../cfg.json")
const tasker = require("../requestqueue.js")
module.exports = {
    func:async (ctx)=>{
        console.log(ctx.update.callback_query)
        const userid = ctx.update.callback_query.from.id
        if(!telegramm.admins[userid]) return
        tasker.queue = []
        await ctx.reply("Admin: Очередь задачь отчищена.")
    }
}