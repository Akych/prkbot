const tasker = require("../requestqueue.js")
const getuserid = require("../helpers/getuserid.js")
const db = require("../../database/db.js")
const getimages = require("../../modules/getimagebyname.js")
const {telegramm} = require("../../cfg.json")
const { InputFile } = require("grammy");
const startcmd = require("../commands/start.js")


module.exports = {
    func:async (ctx,none,day)=>{
        var userID = getuserid(ctx)
        if (tasker.userHasBan(userID)) return

        var subs = await db.getUserSubScribes(userID)
        console.log(subs)
        if(!subs || subs === "{}" || subs.subscribes === "{}"){

            const buttons = []
            buttons.push(                    [
                { text: 'Ок', callback_data: 'redirect:start' },
            ])
            await ctx.reply(`У вас нет активных подписок! Перейдите в раздел ${telegramm.emoji.subs} Подписки и настройте!`, {
                reply_markup: {
                  inline_keyboard: buttons,
                },
              });
              await ctx.deleteMessage()

            return
        }

        subs = JSON.parse(subs.subscribes)
        var incrementer = 0
        for (const key in subs) {
            
            const item_name = subs[key]
            tasker.add({
                userid : userID,
                addbantime : 5, // по приколу чтоб не спамили
                func : async ()=>{
                  ctx : ctx,
                  incrementer+=1
                  //console.log(incrementer>=subs.length,incrementer,Object.keys(subs).length)
                    const images = await getimages(item_name,"/"+key)
                    const mediaGroup = images.map((fileName) => ({
                        type: 'photo',
                        media: new InputFile(fileName),
                    }));
                    mediaGroup[mediaGroup.length-1].caption = `Расписание для ${item_name}`
                    await ctx.replyWithMediaGroup(mediaGroup)
                   // console.log(incrementer,Object.keys(subs).length)
                    if(incrementer>=Object.keys(subs).length){
                       startcmd.callback(ctx)
                    }
                }
            })

        }
        
      await ctx.deleteMessage()
    }
}