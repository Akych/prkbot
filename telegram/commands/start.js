const storage = require("../../helpers/globaldata.js")
const { generateInlineKeyboardButtons } = require("../helpers/buttonFormater.js")

module.exports = {
    desc : "Начать работу с ботом",
    callback:async (ctx)=>{
          await ctx.reply("Добро пожаловать в генератор расписания.", {
            reply_markup: {
                inline_keyboard:[
                    [
                        { text: 'Группы', callback_data: 'redirect:groups' },
                        { text: 'Преподаватели(no work)', callback_data: 'redirect:peoples' },
                      //  { text: 'Кабинеты(no work)', callback_data: 'redirect:rooms' }
                    ]
                  // [
                  //     { text: 'Автоматизация(no work)', callback_data: 'redirect:automatization' },
                  // ],
                ],
            },
        });
    }
}
