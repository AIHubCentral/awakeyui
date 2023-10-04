const pingCommand = require("../commands/ping");

const findCommand = require("../commands/findmodel");

module.exports = async (bot: any, interaction: any) => {
  try {
    switch (interaction.data.name) {
      case "ping":
        pingCommand(bot, interaction);
      case "find":
        findCommand(bot, interaction);
    }
  } catch (err: any) {

  }
}