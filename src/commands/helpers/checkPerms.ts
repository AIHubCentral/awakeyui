module.exports = (bot: any, message: any, permissions: Array<string>) => {
  bot.logger.debug({text: "checkPerms"});
  if (message.author.id == process.env.BOT_OWNER) {
    bot.logger.debug({text: "is owner, bypassing perms check"});
    return true;
  } else {
    // check if message author has the required permissions, if yes, return true
    console.log(bot.guilds.get(message.guildID).members.get(message.author.id).permissions);
    return !!bot.guilds.get(message.guildID).members.get(message.author.id).permissions.has(permissions);
  }
}