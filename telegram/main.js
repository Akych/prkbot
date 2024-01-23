const storage = require("../helpers/globaldata.js")
const getimages = require("../modules/getimagebyname.js")
const tasker = require("./requestqueue.js")
const { Bot, InputFile } = require("grammy");
const {telegramm} = require("../cfg.json")
const fs = require('fs');
const botToken = telegramm.token;
const bot = new Bot(botToken);
const commandscache = {}
function registerCommands() {
    const commands = []
    const commandFiles = fs.readdirSync(__dirname+'/commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const commandName = file.split('.')[0];
        const commandData = require(`./commands/${file}`);
        commandscache[commandName] = commandData
        commands.push({ command: commandName, description: commandData.desc })
        bot.command(commandName, (ctx) => {
            commandData.callback(ctx)
        });
    }
        
    bot.on("callback_query:data", async (ctx) => {
        const data = ctx.callbackQuery.data
        if (data.startsWith('groups:')) {
            const group = data.split(':')[1];
            var userID = ctx.callbackQuery.from.id
            tasker.add({
                userid : userID,
                func : async ()=>{
                    const images = await getimages(group,"/groups")
                    const mediaGroup = images.map((fileName) => ({
                        type: 'photo',
                        media: new InputFile(fileName),
                    }));
                    mediaGroup[mediaGroup.length-1].caption = `Расписание для ${group}`
                    await ctx.replyWithMediaGroup(mediaGroup)
                }
            })
        }

        if (data.startsWith('peoples:')) {
            const people = data.split(':')[1];
            var userID = ctx.callbackQuery.from.id
            tasker.add({
                userid : userID,
                func : async ()=>{
                    const images = await getimages(people,"/people")
                    const mediaGroup = images.map((fileName) => ({
                        type: 'photo',
                        media: new InputFile(fileName),
                    }));
                    mediaGroup[mediaGroup.length-1].caption = `Расписание для ${people}` 
                    await ctx.replyWithMediaGroup(mediaGroup)
                }
            })
        }


        if (data.startsWith('redirect:')) {
            const command = data.split(':')[1];
            commandscache[command].callback(ctx)
            try {
                if(!ctx){return}
                ctx.deleteMessage()
            } catch (error) {
                
            }
            
        }
    });
    bot.api.setMyCommands(commands);
}

function startBot() {
  registerCommands();

  bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
      console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
      console.error("Could not contact Telegram:", e);
    } else {
      console.error("Unknown error:", e);
    }
  });
  bot.start();


}

// Запуск бота
startBot();
