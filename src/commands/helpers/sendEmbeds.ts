const noEmbed = require('./noEmbed');

module.exports = (bot: any, message: any, embeds: any) => {
  try {
    bot.logger.debug({text: embeds});
    bot.createMessage(message.channel.id, {
      content: "",
      embeds: embeds,
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
