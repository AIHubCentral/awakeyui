module.exports = (bot: any, message: any) => {
  bot.logger.debug({text: "[pingCmd] ping"});
  bot.createMessage(message.channel.id, {
    content: `:ping_pong:`,
    messageReference: {messageID: message.id}
  }).then((msg: any) => {
    let apiPing = Date.now() - msg.timestamp;
    let embed = {
      description: `**${message.author.username}** :ping_pong: ${apiPing}ms`,
      color: 0x00ff00,
    }
    msg.edit({content: "", embed: embed});
  }).catch((err: any) => {
    bot.logger.error({text: `[pingCmd] Error in ping:\n` + err});
    // @ts-ignore
    bot.logger.debug({text: err.stack});
    bot.createMessage(message.channel.id, {
      content: `:x: Unable to create embed.\nPing: ${Date.now() - message.timestamp}ms\nNote that this includes the failed attempt to create an embed.`,
      messageReference: {messageID: message.id}
    });
  });
}