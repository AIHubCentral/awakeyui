const pingCommand = require("../commands/ping");
const findCommand = require("../commands/findmodel");
const ppdfCommand = require("../commands/ppdf");

const sendInteractionEmbed = require("../commands/helpers/sendInteractionEmbed");

module.exports = async (bot: any, interaction: any) => {
  try {
    switch (interaction.data.name) {
      case "ping":
        pingCommand(bot, interaction);
        break;
      case "find":
        findCommand(bot, interaction);
        break;
      case "ppdf":
        ppdfCommand(bot, interaction);
        break;
      case "about":
        sendInteractionEmbed(bot, interaction, bot.presets.embeds.about);
        break;
    }
  } catch (err: any) {

  }
}