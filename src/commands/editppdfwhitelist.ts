module.exports = (bot: any, message: any, commandArgs: Array<string>) => {
  switch (commandArgs[1]) {
    case "add":
      // add commandArgs[2] to ppdf list
      // list is jsons/data/ppdfWhitelist.json
      const addlist = require("../../jsons/data/ppdfWhitelist.json")
      if (addlist.includes(commandArgs[2])) {
        bot.createMessage(message.channel.id, {
          content: "",
          embed: bot.presets.embeds.editPpdfAlreadyOnList,
          messageReference: {messageID: message.id}
        })
        return;
      } else {
        addlist.push(commandArgs[2])
        // save list to json
        bot.fs.writeFileSync("./jsons/data/ppdfWhitelist.json", JSON.stringify(addlist, null, 2))
        bot.createMessage(message.channel.id, {
          content: "",
          embed: bot.presets.embeds.editPpdfAddedToList,
          messageReference: {messageID: message.id}
        })
        return;
      }
    case "remove":
      // remove commandArgs[2] from ppdf list
      // list is jsons/data/ppdfWhitelist.json
      const removelist = require("../../jsons/data/ppdfWhitelist.json")
      if (!removelist.includes(commandArgs[2])) {
        bot.createMessage(message.channel.id, {
          content: "",
          embed: bot.presets.embeds.editPpdfNotOnList,
          messageReference: {messageID: message.id}
        })
        return;
      } else {
        removelist.splice(removelist.indexOf(commandArgs[2]), 1)
        // save list to json
        bot.fs.writeFileSync("./jsons/data/ppdfWhitelist.json", JSON.stringify(removelist, null, 2))
        bot.createMessage(message.channel.id, {
          content: "",
          embed: bot.presets.embeds.editPpdfRemovedFromList,
          messageReference: {messageID: message.id}
        })
        return;
      }
    case "list":
      // list is jsons/data/ppdfWhitelist.json
      const list = require("../../jsons/data/ppdfWhitelist.json")
      bot.createMessage(message.channel.id, {
        content: "",
        embed: {
          title: "ppdf whitelist",
          description: `\`\`\`json\n${JSON.stringify(list, null, 2)}\`\`\``,
          color: 0x00ff00,
        },
        messageReference: {messageID: message.id}
      })
      return;
    default:
      bot.createMessage(message.channel.id, {
        content: "",
        embed: bot.presets.embeds.editPpdfInvalidSubcommand,
        messageReference: {messageID: message.id}
      });
      return;
  }
}