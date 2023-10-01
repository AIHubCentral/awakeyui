import puppeteer from "puppeteer";

const Eris = require("eris");

const bot = new Eris(`Bot ${process.env.TOKEN}`, {
  intents: [
    "guildMessages",
    "guilds",
    "guildMembers",
  ],
  restMode: true,
});


bot.logger = require("./handlers/logger");
bot.fs = require("fs");

bot.logger.startup({text: `Loading objects...`});

bot.logger.startup({text: `Loading presets...`});
// load every json from jsons/embeds into bot.presets.embeds
bot.presets = {
  embeds: {}
}
bot.fs.readdirSync("./jsons/embeds").forEach((file: string) => {
  bot.presets.embeds[file.split(".")[0]] = require(`../jsons/embeds/${file}`);
});
bot.logger.startup({text: `Loaded presets!`});

(async () => {
  bot.logger.startup({text: `Loading headless browser...`});
  bot.browser = await puppeteer.launch({headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox"]});
  bot.logger.startup({text: `Loaded headless browser!`});
})();

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

bot.logger.startup({text: `Loaded events!`});

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