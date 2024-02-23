
const {telegramm} = require("../../cfg.json")
const settings = require("../../settings.js")

const adminmenu = require(`../commands_func/adminmenu.js`);
const modes = {
    [1] : "all",
    [2] : "admins",
    [3] : "off",
    "all" : 1,
    "admins" : 2,
    "off" : 3, // тупо... но должно работать как часы
}
const func = 
module.exports = {
    func:async (ctx)=>{
        console.log(ctx.update.callback_query)
        const userid = ctx.update.callback_query.from.id
        if(!telegramm.admins[userid]) return
        var cur_mode = settings.get("deliverymode","all")
        var index = modes[cur_mode]
        index += 1
        if(!modes[index]){index=1}
        settings.set("deliverymode",modes[index])
        adminmenu.func(ctx)
    }
}