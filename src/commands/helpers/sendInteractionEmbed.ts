const noEmbed = require('./noInteractionEmbed');

module.exports = async (bot: any, interaction: any, embed: any) => {
  try {
    bot.logger.debug({text: embed});
    interaction.createMessage({
      content: "",
      embed: embed,
    })
    return;
  } catch (err) {
    bot.logger.error({text: `Could not send embed:\n` + err});
    // @ts-ignore
    bot.logger.debug({text: err.stack});
    noEmbed(bot, interaction);
    return;
  }
}
