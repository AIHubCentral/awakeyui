const noEmbed = require('./noEmbed');

module.exports = (bot: any, message: any, embed: any) => {
  try {
    bot.logger.debug({text: embed});
    bot.createMessage(message.channel.id, {
      content: "",
      embed: embed,
      messageReference: {messageID: message.id}
    })
    return;
  } catch (err) {
    bot.logger.error({text: `Could not send embed:\n` + err});
    // @ts-ignore
    bot.logger.debug({text: err.stack});
    noEmbed(bot, message);
    return;
  }
}
