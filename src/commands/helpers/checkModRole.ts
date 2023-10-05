module.exports = (bot: any, interaction: any) => {
  bot.logger.debug({text: "checkModRole"});
  if (interaction.member.id == process.env.BOT_OWNER) {
    bot.logger.debug({text: "is owner, bypassing perms check"});
    return true;
  } else {
    // check if user has process.env.MOD_ROLE
    bot.logger.debug({text: "mod role?"});
    bot.logger.debug({text: bot.guilds.get(interaction.guildID).members.get(interaction.member.id).roles});
    return !!bot.guilds.get(interaction.guildID).members.get(interaction.member.id).roles.includes(bot.cfx.modRole);
  }
}