import * as Eris from "eris";

const hfapi = require('./helpers/hfapi');

function sendNotSupported(bot: any, message: any, site: string) {
  bot.createMessage(message.channel.id, {
    content: `:x: ${site} is not yet supported`,
    messageReference: {messageID: message.id}
  })
  return;
}

function sendNoResults(bot: any, message: any) {
  bot.createMessage(message.channel.id, {
    content: `:x: No results found`,
    messageReference: {messageID: message.id}
  })
  return;
}

function couldNotSendEmbed(bot: any, message: any) {
  bot.createMessage(message.channel.id, {
    content: `:x: Embed could not be sent`,
    messageReference: {messageID: message.id}
  })
  return;
}

module.exports = (bot: any, message: any, site: string, query: Array<string>) => {
  bot.logger.debug({text: "[pingCmd] findmodel"});

  bot.logger.debug({text: site});
  bot.logger.debug({text: query});

  if (site == "hf") {
    hfapi.getModel(query).then((res: any) => {
      bot.logger.debug({text: res});
      if (res == undefined) {
        sendNoResults(bot, message);
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
            name: model.id.split("/")[1],
            value: "- **Author:** " + model.id.split("/")[0] + "\n- **Downloads:** " + model.downloads + "\n- **Likes:** " + model.likes + "\n- **Tags:**\n```json\n" + JSON.stringify(model.tags) + "```\n- **Pipeline-Tag:** `" + model.pipeline_tag + "`\n- [**URL**](https://huggingface.co/" + model.id + "): https://huggingface.co/" + model.id
          })
        })
        try {
          bot.createMessage(message.channel.id, {
            content: "",
            embed: embed,
            messageReference: {messageID: message.id}
          })
          return;
        } catch (err) {
          bot.logger.error({text: `[findmodelCmd] Error in findmodel:\n` + err});
          // @ts-ignore
          bot.logger.debug({text: err.stack});
          couldNotSendEmbed(bot, message);
          return;
        }
      }
    })
  } else if (site == "cv") {
    sendNotSupported(bot, message, "Civitai");
    return;
  } else if (site == "wgg") {
    sendNotSupported(bot, message, "Weights.gg");
    return;
  }
}