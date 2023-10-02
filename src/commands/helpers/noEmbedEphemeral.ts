module.exports = async (bot: any, message: any) => {
  await bot.createMessage(message.channel.id, {
    content: `:x: Embed could not be sent`,
    messageReference: {messageID: message.id},
    flags: 1 << 6,
  })
}