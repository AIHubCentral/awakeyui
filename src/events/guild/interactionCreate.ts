module.exports = async (bot: any, interaction: any) => {
  try {
    bot.logger.debug({text: "interactionCreate"});
    bot.logger.debug({text: interaction});
    bot.logger.debug({text: interaction.type});
    switch (interaction.type) {
      case 2:
        bot.logger.debug({text: "interaction type 2"});
        bot.logger.debug({text: interaction.data});
        break;
      case 3:
        bot.logger.debug({text: "interaction type 3"});
        bot.logger.debug({text: interaction.data});
        break;
    }
  } catch (err: any) {
    bot.logger.error(err);
  }
}