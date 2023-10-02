module.exports = (bot: any, message: any) => {
  bot.logger.debug({text: "checkModRole"});
  if (message.author.id == process.env.BOT_OWNER) {
    bot.logger.debug({text: "is owner, bypassing perms check"});
    return true;
  } else {
    // check if user has process.env.MOD_ROLE
    bot.logger.debug({text: "mod role?"});
    bot.logger.debug({text: bot.guilds.get(message.guildID).members.get(message.author.id).roles});
    return !!bot.guilds.get(message.guildID).members.get(message.author.id).roles.includes(bot.cfx.modRole);
  }
}