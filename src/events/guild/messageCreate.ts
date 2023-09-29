const handleCommands = require('../../handlers/commands');

module.exports = (bot: any, message: any) => {
    try {
        if (message.content.startsWith(`${process.env.PREFIX}`)) {
            bot.logger.debug({text: "messageCreate"});
            bot.logger.debug({text: message.content});

            /*if (message.content == `${process.env.PREFIX}ping`) {
                bot.logger.debug({text: "ping"});
                bot.createMessage(message.channel.id, {
                    content: `:ping_pong:`,
                    messageReference: {messageID: message.id}
                }).then((msg: any) => {
                    let apiPing = Date.now() - msg.timestamp;
                    let embed = {
                        description: `**${message.author.username}#${message.author.discriminator}** :ping_pong: ${apiPing}ms`,
                        color: 0x00ff00,
                    }
                    msg.edit({content: "", embed: embed});
                });
            } else if (message.content.startsWith(`${process.env.PREFIX}warp`)) {

            }*/

            handleCommands(bot, message)


        }
    } catch (err) {
        bot.logger.error({text: `Error in messageCreate:\n` + err});
        // @ts-ignore
        bot.logger.debug({text: err.stack});
    }

}