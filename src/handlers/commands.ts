const helperCheckPermissions = require("../commands/helpers/checkPerms")

const cmdPing = require("../commands/ping")
const cmdPpdf = require("../commands/ppdf")
const cmdFind = require("../commands/findmodel")


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

          const site = commandArgs[0]
          const query = commandArgs.slice(1)
          if (site == "help") {
            bot.createMessage(message.channel.id, {
              content: `Usage: \`${process.env.PREFIX}find <site> <query*>\`\n\n\`<site>\` can be one of the following:\n- \`hf\` (huggingface)\n- \`cv\` (civitai)\n\n\`<query>\` is the search query. It can be anything, but it's best to use tags or model names.\nYou have access to the following **OPTIONAL** arguments:\n- \`-s <value>\` or \`--sort <value>\` sort by something, can be one of the following: downloads, author, name, created, updated, size\n- \`-a <value>\` or \`--author <value>\` has to be the exact name of the author\n- \`-f <value>\` or \`--filter <value>\` has to be one of the tags such as text-classification, text-generation or spacy`,
              messageReference: {messageID: message.id}
            })
            return;
          } else if (!site || query.length <= 0) {
            bot.createMessage(message.channel.id, {
              content: `:x: Please provide valid args;\nUsage: \`${process.env.PREFIX}find <site> <query*>\``,
              messageReference: {messageID: message.id}
            })
            return;
          } else if (site != "hf" && site != "cv") {
            bot.createMessage(message.channel.id, {
              content: `:x: Please provide a valid site;\nOptions are:\n- \`hf\` (huggingface)\n- \`cv\` (civitai)`,
              messageReference: {messageID: message.id}
            })
            return;
          } else {
            bot.logger.debug({text: site});
            bot.logger.debug({text: query});
          }

          cmdFind(bot, message, site, query)

          break;
      }
    }
  } catch (err) {
    bot.logger.error({text: `Error in messageCreate:\n` + err});
    // @ts-ignore
    bot.logger.debug({text: err.stack});
  }
}