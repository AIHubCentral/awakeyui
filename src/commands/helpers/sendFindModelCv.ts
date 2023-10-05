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
          name: model.name,
          value: "- **Author:** " + model.creator.username + "\n- **Downloads:** " + model.stats.downloadCount + "\n- **Rating:** " + model.stats.rating + "\n- **Tags:**\n```json\n" + JSON.stringify(model.tags) + "```\n- **Type:** `" + model.type + "`\n- [**URL**](https://civitai.com/models/" + model.id + "): https://civitai.com/models/" + model.id
        })
      });
      sendInteractionEmbed(bot, interaction, embed)
    } else {
      const model = res[0];
      let content = bot.turndownService.turndown(model.description || "unknown");
      if (content.length > 4096) {
        // cut the string to 4093 characters
        content = content.slice(0, 4093) + "...";
      }
      // create embed
      let embed = {
        title: model.name || "unknown",
        color: 0x00ff00,
        description: content || "unknown",
        author: {
          name: model.creator?.username || "unknown",
          icon_url: model.creator?.image || "unknown",
        },
        image: {
          url: model.nsfw ? undefined : model.image || undefined,
        },
        fields: [
          {
            name: "Downloads",
            value: model.stats?.downloadCount || "unknown",
            inline: true,
          },
          {
            name: "Rating",
            value: model.stats?.rating?.toString() || "unknown",
            inline: true,
          },
          {
            name: "Tags",
            value: "```json\n" + JSON.stringify(model.tags) + "```",
          },
          {
            name: "Type",
            value: model.type || "unknown",
            inline: true,
          },
          {
            name: "URL",
            value: "https://civitai.com/models/" + model.id || "unknown",
            inline: true,
          },
        ]
      }
      sendInteractionEmbed(bot, interaction, embed)
    }
  } catch (err) {
    bot.logger.error({text: `Error in hf:\n` + err});
    // @ts-ignore
    bot.logger.debug({text: err.stack});
    return;
  }
}
