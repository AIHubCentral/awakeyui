const pingCommand = require("../commands/ping");
const findCommand = require("../commands/findmodel");
const ppdfCommand = require("../commands/ppdf");

module.exports = async (bot: any, interaction: any) => {
  try {
    switch (interaction.data.name) {
      case "ping":
        pingCommand(bot, interaction);
      case "find":
        findCommand(bot, interaction);
      case "ppdf":
        ppdfCommand(bot, interaction);
    }
  } catch (err: any) {

  }
}