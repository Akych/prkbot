
const temcleaner = require("../../helpers/tempcleaner.js")
const {telegramm} = require("../../cfg.json")
const editor = require("../../modules/exceleditor.js")

module.exports = {
    func:async (ctx)=>{
        console.log(ctx.update.callback_query)
        const userid = ctx.update.callback_query.from.id
        if(!telegramm.admins[userid]) return

        await temcleaner.run()
        await ctx.reply("Admin: КЕШ удален.")
        await editor.run()
        await ctx.reply("Admin: Таблица перегенерированна")
    }
}