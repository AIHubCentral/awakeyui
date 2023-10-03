import puppeteer from "puppeteer";
import OpenAI from "openai";

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
bot.openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
bot.axios = require("axios").default;
bot.path = require('path');
bot.cfx = {
  allowMultipleTranscriptions: process.env.TRANSCRIPTION_ALLOW_MULTIPLE === "true",
  modRole: process.env.MOD_ROLE,
  commandCooldown: parseInt(`${process.env.COMMAND_COOLDOWN}`),
  requestModelChannel: process.env.REQUEST_MODEL_CHANNEL,
}

bot.logger.startup({text: `Loading objects...`});
bot.lists = {
  createdRequestThreads: []
}

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
  bot.browser = await puppeteer.launch({headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox"]}); // runs in VM anyway + only whitelisted pages
  bot.logger.startup({text: `Loaded headless browser!`});
})();

bot.logger.startup({text: `Loading events...`});

const onReady = require("./events/bot/ready");
bot.on("ready", () => {
  onReady(bot)
});

const interactionCreate = require("./events/guild/interactionCreate");
bot.on("interactionCreate", async (message: any) => {
  await interactionCreate(bot, message)
});

const messageCreate = require("./events/guild/messageCreate");
bot.on("messageCreate", async (message: any) => {
  await messageCreate(bot, message)
});

bot.on("error", (err: any) => {
  bot.logger.error({text: err});
});

process.on("unhandledRejection", (err: any) => {
  bot.logger.error({text: err});
});

process.on("uncaughtException", (err: any) => {
  bot.logger.error({text: err});
});

process.on("warning", (err: any) => {
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