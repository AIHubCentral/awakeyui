module.exports = (bot: any, interaction: any) => {
  bot.logger.debug({text: "[pingCmd] ping"});
  const nowTime = Date.now();
  interaction.createMessage({
    content: `:ping_pong:`,
  }).then((msg: any) => {
    bot.logger.debug({text: interaction});
    let apiPing = Date.now() - nowTime;
    bot.logger.debug({text: interaction.member});
    let embed = {
      description: `**${interaction.member.user.username}** :ping_pong: ${apiPing}ms`,
      color: 0x00ff00,
    }
    interaction.editOriginalMessage({content: "", embed: embed});
  }).catch((err: any) => {
    bot.logger.error({text: `[pingCmd] Error in ping:\n` + err});
    // @ts-ignore
    bot.logger.debug({text: err.stack});
    interaction.createMessage({
      content: `:x: Unable to create embed.\nPing: ${Date.now() - nowTime}ms\nNote that this includes the failed attempt to create an embed.`,
    });
  });
}