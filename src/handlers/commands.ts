const helperCheckPermissions = require("../commands/helpers/checkPerms")
const helperCheckModRole = require("../commands/helpers/checkModRole")
const helperDeniedCommand = require("../commands/helpers/deniedCommand")
const helperSendEmbed = require("../commands/helpers/sendEmbed")

const cmdPing = require("../commands/ping")
const cmdPpdf = require("../commands/ppdf")
const cmdFind = require("../commands/findmodel")
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
            bot.createMessage(message.channel.id, {
              content: `:x: Please provide a valid URL`,
              messageReference: {messageID: message.id}
            })
            return;
          }
          cmdPpdf(bot, message, url, pdf)
          break;
        case "find":

          const validSites = ["hf", "cv", "wgg"]

          const site = commandArgs[0]
          const query = commandArgs.slice(1)
          if (site == "help") {
            helperSendEmbed(bot, message, bot.presets.embeds.findHelp)
            return;
          } else if (!site || query.length <= 0) {
            bot.createMessage(message.channel.id, {
              content: `:x: Please provide valid args;\nUsage: \`${process.env.PREFIX}find <site> <query*>\`\nType \`${process.env.PREFIX}find help\` for more info`,
              messageReference: {messageID: message.id}
            })
            return;
          } else if (!validSites.includes(site)) {
            bot.createMessage(message.channel.id, {
              content: `:x: Please provide a valid site;\nOptions are:\n- \`hf\` (huggingface)\n- \`cv\` (civitai)\n- \`wgg\` (weights.gg)`,
              messageReference: {messageID: message.id}
            })
            return;
          } else {
            bot.logger.debug({text: site});
            bot.logger.debug({text: query});
          }

          cmdFind(bot, message, site, query)

          break;
        case "help":

          if (commandArgs.length <= 0) {
            bot.createMessage(message.channel.id, {
              content: `:x: Please provide a command name;\nUsage: \`${process.env.PREFIX}help <command>\`\nCommands are:\n- \`ping\`\n- \`ppdf\`\n- \`find\``,
              messageReference: {messageID: message.id}
            });
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
                cmdEditPpdfWhitelist(bot, message, commandArgs)
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