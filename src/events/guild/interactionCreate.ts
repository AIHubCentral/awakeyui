const transcribe = require("../../commands/transcribeInteract");

module.exports = async (bot: any, interaction: any) => {
  try {
    bot.logger.debug({text: "interactionCreate"});
    bot.logger.debug({text: interaction});
    bot.logger.debug({text: interaction.type});
    switch (interaction.type) {
      case 2:
        bot.logger.debug({text: "interaction type 2"});
        bot.logger.debug({text: interaction.data});
        switch (interaction.data.name.toLowerCase()) {
          case "transcribe":
            await transcribe(bot, interaction);
        }
    }
  } catch (err: any) {
    bot.logger.error(err)
  }
}