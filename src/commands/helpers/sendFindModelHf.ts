const sendInteractionEmbedEphemeral = require("./sendInteractionEmbedEphemeral");
const sendInteractionEmbed = require("./sendInteractionEmbed");

module.exports = async (bot: any, interaction: any, res: any) => {
  try {
    bot.logger.debug({text: res});
    if (res == undefined || res.length == 0) {
      await sendInteractionEmbedEphemeral(bot, interaction, bot.presets.embeds.findNoResultsFound)
      return;
    } else {
      // create embed
      let embed = {
        title: (res.length !== 10 ? res.length : "10 or more") + ` result${res.length !== 1 ? "s" : ""} found`,
        color: 0x00ff00,
        fields: [] as Array<object>
      }
      res.forEach((model: any) => {
        embed.fields.push({
          name: model.id.split("/")[1] ? model.id.split("/")[1] : model.id,
          value: "- **Author:** " + model.id.split("/")[0] + "\n- **Downloads:** " + model.downloads + "\n- **Likes:** " + model.likes + "\n- **Tags:**\n```json\n" + JSON.stringify(model.tags) + "```\n- **Pipeline-Tag:** `" + model.pipeline_tag + "`\n- [**URL**](https://huggingface.co/" + model.id + "): https://huggingface.co/" + model.id
        })
      })
      await sendInteractionEmbed(bot, interaction, embed);
    }
  } catch (err) {

  }
}