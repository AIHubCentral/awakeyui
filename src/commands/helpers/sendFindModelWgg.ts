const sendInteractionEmbedEphemeral = require("./sendInteractionEmbedEphemeral");
const sendInteractionEmbed = require("./sendInteractionEmbed");

module.exports = async (bot: any, interaction: any, res: any) => {
  try {
    bot.logger.debug({text: res});
    if (res == undefined || res.length == 0) {
      sendInteractionEmbedEphemeral(bot, interaction, bot.presets.embeds.findNoResultsFound)
      return;
    } else if (res.length > 1) {
      // create embed
      let embed = {
        title: (res.length !== 10 ? res.length : "10 or more") + ` result${res.length !== 1 ? "s" : ""} found`,
        color: 0x00ff00,
        fields: [] as Array<object>
      }
      res.forEach((model: any) => {
        embed.fields.push({
          name: model.title,
          value: "- **Author:** " + model.discordUser + " <@" + model.discordUserId + ">" + "\n- **Description:**\n```\n" + model.content + "```\n- **Likes:** " + model._count.Likes + "\n- **Tags:**\n```json\n" + JSON.stringify(model.tags) + "```\n- **Epochs:** " + model.epochs + "\n- **Created at:** <t:" + (Math.floor(Date.parse(model.createdAt).valueOf() / 1000)) + ":R>\n- [**Weights.gg**](https://www.weights.gg/models/" + model.id + "): https://www.weights.gg/models/" + model.id + "\n- [**Huggingface.co**](" + model.url + "): " + model.url
        })
      })
      sendInteractionEmbed(bot, interaction, embed)
    } else {
      const model = res[0];
      // create embed
      let embed = {
        title: model.title || "unknown",
        description: model.content || "unknown",
        color: 0x00ff00,
        author: {
          name: model.discordUser,
          icon_url: model.discordUserAvatar,
        },
        fields: [
          {
            name: "Likes",
            value: model._count.Likes || "unknown",
            inline: true,
          },
          {
            name: "Epochs",
            value: model.epochs || "unknown",
            inline: true,
          },
          {
            name: "Created",
            value: "<t:" + (Math.floor(Date.parse(model.createdAt).valueOf() / 1000)) + ":R>",
            inline: true,
          },
          {
            name: "Tags",
            value: "```json\n" + JSON.stringify(model.tags) + "```",
          },
          {
            name: "Weights.gg",
            value: "https://www.weights.gg/models/" + model.id || "unknown",
            inline: true,
          },
          {
            name: "Huggingface.co",
            value: model.url || "unknown",
            inline: true,
          }
        ]
      }
      if (model.discordUserId) {
        // fetch user
        bot.getRESTUser(model.discordUserId).then(async (user: any) => {
          embed.author = {
            name: user.username,
            icon_url: user.avatarURL
          }
          sendInteractionEmbed(bot, interaction, embed);
        });
      } else {
        sendInteractionEmbed(bot, interaction, embed);
      }
    }
  } catch (err) {
    bot.logger.error({text: `Error in hf:\n` + err});
    // @ts-ignore
    bot.logger.debug({text: err.stack});
    return;
  }
}
