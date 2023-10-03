const pingCommand = require("../commands/ping");

module.exports = (bot: any, interaction: any) => {
  try {
    switch (interaction.data.name) {
      case "ping":
        pingCommand(bot, interaction);
    }
  } catch (err: any) {

  }
}