const handleCommands = require('../../handlers/commands');

module.exports = async (bot: any, message: any) => {
  try {
    bot.logger.debug({text: "messageCreate"});
    bot.logger.debug({text: message.content});
    if (message.content.startsWith(`${process.env.PREFIX}`)) {
      bot.logger.debug({text: "isCommand"});

      handleCommands(bot, message)

    }
  } catch (err) {
    bot.logger.error({text: `Error in messageCreate:\n` + err});
    // @ts-ignore
    bot.logger.debug({text: err.stack});
  }

}