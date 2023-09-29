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
  });
}