const storage = require("../../helpers/globaldata.js")
const { generateInlineKeyboardButtons } = require("../helpers/buttonFormater.js")

module.exports = {
    desc : "Получить список Кабинетов",
    callback:async (ctx)=>{

          const buttons = []
          buttons.push(                    [
              { text: 'Назад', callback_data: 'redirect:peoples' },
          ])
          await ctx.reply("Выберите Кабинет", {
            reply_markup: {
              inline_keyboard: buttons,
            },
          });
    },
}