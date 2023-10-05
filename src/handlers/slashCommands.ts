const pingCommand = require("../commands/ping");
const findCommand = require("../commands/findmodel");
const ppdfCommand = require("../commands/ppdf");

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
    }
  } catch (err: any) {

  }
}