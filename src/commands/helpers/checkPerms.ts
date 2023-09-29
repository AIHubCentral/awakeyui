module.exports = (bot: any, message: any, permissions: Array<string>) => {
  // check if message author has the required permissions, if yes, return true
  bot.logger.debug({text: "checkPerms"});
  if (permissions.includes("owner")) {
    bot.logger.debug({text: "owner"});
    return message.author.id == process.env.BOT_OWNER;
  } else {
    console.log(bot.guilds.get(message.guildID).members.get(message.author.id).permissions);
    return !!bot.guilds.get(message.guildID).members.get(message.author.id).permissions.has(permissions);
  }
}