const transcribe = require("../../commands/transcribeInteract");
const sendInteractionEmbedEphemeral = require("../../commands/helpers/sendInteractionEmbedEphemeral");

module.exports = async (bot: any, interaction: any) => {
  try {
    bot.logger.debug({text: "interactionCreate"});
    bot.logger.debug({text: interaction});
    bot.logger.debug({text: interaction.type});
    switch (interaction.type) {
      case 2:
        bot.logger.debug({text: "interaction type 2"});
        bot.logger.debug({text: interaction.data});
        switch (interaction.data.name.toLowerCase()) {
          case "transcribe":
            await transcribe(bot, interaction);
            break;
        }
        break;
      case 3:
        bot.logger.debug({text: "interaction type 3"});
        bot.logger.debug({text: interaction.data});
        switch (interaction.data.custom_id.toLowerCase().split("_")[0]) {
          case "request":
            bot.logger.debug({text: "request"});
            const thread_id = interaction.data.custom_id.toLowerCase().split("_")[2];
            bot.logger.debug({text: thread_id});
            const thread = await bot.getChannel(thread_id);

            // check if interaction author is thread author
            bot.logger.debug({text: interaction.member.user.id});
            bot.logger.debug({text: thread?.ownerID});
            if (interaction.member.user.id != thread?.ownerID) {
              return sendInteractionEmbedEphemeral(bot, interaction, {
                title: "Error",
                description: `**You are not authorized to do that!**`,
                color: 0xff0000,
              });
            }

            switch (interaction.data.custom_id.toLowerCase().split("_")[1]) {
              case "deny":
                bot.logger.debug({text: "deny"});
                sendInteractionEmbedEphemeral(bot, interaction, {
                  title: "Model Denied",
                  description: `**You have denied the suggested model**`,
                }).then(async (msg: any) => {
                  bot.logger.debug({text: interaction.message});
                  // delete message
                  const parentMessage = await bot.getMessage(thread_id, interaction.message.id);
                  parentMessage.delete();
                });
                break;
              case "accept":
                bot.logger.debug({text: "accept"});
                // reply to messagw with "user has decided to use an already existing model"
                interaction.acknowledge().then(async (msg: any) => {
                  interaction.editMessage(interaction.message.id, {
                    content: "",
                    embed: interaction.message.embeds[0],
                    components: [],
                  }).then((msg: any) => {
                    // edit interaction message to remove the buttons and only leave the embed and url button
                    interaction.createFollowup({
                      content: `**Request Canceled**`,
                      embed: {
                        title: "Request Canceled",
                        description: `**The user has decided to use an already existing model**`,
                        color: 0xffffff,
                      }
                    }).then(async (msg: any) => {
                      // lock and archive thread
                      try {
                        await thread.edit({
                          archived: true,
                          locked: true
                        })
                      } catch (err: any) {
                        bot.logger.error("Error while locking and archiving thread!");
                        bot.logger.error({text: err});
                      }
                    });
                  });
                });
                break;
            }
            break;
        }
        break;
    }
  } catch (err: any) {
    bot.logger.error(err);
  }
}