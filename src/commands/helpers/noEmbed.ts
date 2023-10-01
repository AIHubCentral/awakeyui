module.exports = (bot: any, message: any) => {
  bot.createMessage(message.channel.id, {
    content: `:x: Embed could not be sent`,
    messageReference: {messageID: message.id}
  })
  return;
}