const helperCheckModRole = require("../commands/helpers/checkModRole")
const helperDeniedCommand = require("../commands/helpers/deniedCommand")
const helperSendEmbed = require("../commands/helpers/sendEmbed")

const cmdPing = require("../commands/ping")
const cmdPpdf = require("../commands/ppdf")
const cmdEditPpdfWhitelist = require("../commands/editppdfwhitelist")


module.exports = (bot: any, message: any) => {
  try {
    if (!message.guildID) return;

    if (message.content.startsWith(`${process.env.PREFIX}`)) {
      const command = message.content.split(" ")[0].slice(process.env?.PREFIX?.length)
      bot.logger.debug({text: "isCommand"});
      const commandName = command.toLowerCase().split(" ")[0]
      const commandArgs = message.content.split(" ").slice(1)
      bot.logger.debug({text: commandName});
      bot.logger.debug({text: commandArgs});

      switch (commandName) {
        case "ping":
          helperSendEmbed(bot, message, {
            title: "Pong!",
            description: `**Estimated Latency, use /ping for calculated latency**\nTime diff. is ${Date.now() - message.timestamp}ms. API Latency is ${Math.round(bot.ping)}ms`,
          }).then(() => {
            return;
          })
          break;
        case "about":
          helperSendEmbed(bot, message, bot.presets.embeds.about)
          break;
      }
    }
  } catch (err) {
    bot.logger.error({text: `Error in messageCreate:\n` + err});
    // @ts-ignore
    bot.logger.debug({text: err.stack});
  }
}