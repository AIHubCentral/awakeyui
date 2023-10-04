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
          cmdPing(bot, message)
          break;
        case "ppdf":

          // check if there's -p flag
          let pdf: boolean = false
          if (commandArgs[0] == "-p" || commandArgs[0] == "--pdf") {
            pdf = true
            commandArgs.shift()
          }

          const url = commandArgs[0]

          // check if url is valid
          if (!url || (!url.startsWith("http://") && !url.startsWith("https://")) || !url.includes(".") || url.includes(" ")) {
            helperSendEmbed(bot, message, bot.presets.embeds.ppdfInvalidUrl)
            return;
          }
          cmdPpdf(bot, message, url, pdf)
          break;
        case "help":

          if (commandArgs.length <= 0) {
            helperSendEmbed(bot, message, bot.presets.embeds.helpHelp)
            return;
          }
          switch (commandArgs[0]) {
            case "find":
              helperSendEmbed(bot, message, bot.presets.embeds.findHelp)
              break;
            case "ping":
              helperSendEmbed(bot, message, bot.presets.embeds.pingHelp)
              break;
            case "ppdf":
              helperSendEmbed(bot, message, bot.presets.embeds.ppdfHelp)
              break;
          }
          break;
        case "edit":
          if (helperCheckModRole(bot, message)) {
            switch (commandArgs[0]) {
              case "msg":
                break;
              case "embed":
                break;
              case "ppdf":
                //cmdEditPpdfWhitelist(bot, message, commandArgs)
                break;
              default:
                helperSendEmbed(bot, message, bot.presets.embeds.editSubcommand)
                break;
            }
          } else {
            helperDeniedCommand(bot, message)
            return;
          }
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