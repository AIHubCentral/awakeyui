const Eris = require("eris");

const bot = new Eris(`Bot ${process.env.TOKEN}`, {
    intents: [
        "guildMessages",
        "guilds",
        "guildMembers",
    ]
});


bot.logger = require("./handlers/logger");
bot.logger.startup({text: `Loading objects...`});


bot.logger.startup({text: `Loading events...`});

const onReady = require("./events/bot/ready");
bot.on("ready", () => {
    onReady(bot)
});

const messageCreate = require("./events/guild/messageCreate");
bot.on("messageCreate", (message: any) => {
    messageCreate(bot, message)
});

bot.on("error", (err: any) => {
    bot.logger.error({text: err});
});


bot.logger.startup({text: `Connecting to Discord...`});
bot.connect().then(() => {
    bot.logger.startup({text: `Connected to Discord!`});
    bot.logger.debug({text: process.env.PREFIX});
    bot.logger.debug({text: `Setting Status...`});
    bot.editStatus("online", {
        name: process.env.BOT_STATUS,
        type: 0
    })
});