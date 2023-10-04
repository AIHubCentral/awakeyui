module.exports = (bot: any, message: any) => {
  bot.logger.debug({text: "deniedCommand"});
  message.addReaction("❌");
  return;
}