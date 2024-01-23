const storage = require("../../helpers/globaldata.js")
const { generateInlineKeyboardButtons } = require("../helpers/buttonFormater.js")

module.exports = {
    desc : "Получить список Преподователей",
    callback:async (ctx)=>{

          const buttons = generateInlineKeyboardButtons("peoples",storage.get("people"),3)
          buttons.push(                    [
            { text: 'Кабинеты(not work)', callback_data: 'redirect:roms' },
          ])
          buttons.push(                    [
              { text: 'Назад', callback_data: 'redirect:start' },
          ])
          await ctx.reply("Выберите Преподователя", {
            reply_markup: {
              inline_keyboard: buttons,
            },
          });
    },
}