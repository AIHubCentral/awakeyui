const hfapi = require('./helpers/hfapi');
const wggapi = require('./helpers/wggapi');
const cvapi = require('./helpers/cvapi');
const couldNotSendEmbed = require('./helpers/noEmbed');
const sendEmbed = require('./helpers/sendEmbed');

const TurndownService = require('turndown');
const turndownService = new TurndownService()

function sendNotSupported(bot: any, message: any, site: string) {
  bot.createMessage(message.channel.id, {
    content: "",
    embed: bot.presets.embeds.findSiteNotSupported,
    messageReference: {messageID: message.id}
  })
}

function sendNoResults(bot: any, message: any) {
  bot.createMessage(message.channel.id, {
    content: "",
    embed: bot.presets.embeds.findNoResultsFound,
    messageReference: {messageID: message.id}
  })
}


module.exports = (bot: any, message: any, site: string, query: Array<string>) => {
  bot.logger.debug({text: "[pingCmd] findmodel"});

  bot.logger.debug({text: site});
  bot.logger.debug({text: query});
  try {
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
              name: model.id.split("/")[1] ? model.id.split("/")[1] : model.id,
              value: "- **Author:** " + model.id.split("/")[0] + "\n- **Downloads:** " + model.downloads + "\n- **Likes:** " + model.likes + "\n- **Tags:**\n```json\n" + JSON.stringify(model.tags) + "```\n- **Pipeline-Tag:** `" + model.pipeline_tag + "`\n- [**URL**](https://huggingface.co/" + model.id + "): https://huggingface.co/" + model.id
            })
          })
          sendEmbed(bot, message, embed);
        }
      })
    } else if (site == "cv") {
      cvapi.getModel(query).then((res: any) => {
        bot.logger.debug({text: res});
        if (res == undefined) {
          sendNoResults(bot, message);
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
          sendEmbed(bot, message, embed)
        } else {
          const model = res[0];
          // create embed
          let embed = {
            title: model.name || "unknown",
            color: 0x00ff00,
            description: turndownService.turndown(model.description || "unknown"),
            author: {
              name: model.creator?.username || "unknown",
              icon_url: model.creator?.image || "unknown",
            },
            image: {
              url: model.nsfw ? undefined : model.image || "unknown",
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
          sendEmbed(bot, message, embed)
        }
      });
      return;
    } else if (site == "wgg") {
      wggapi.getModel(query).then((res: any) => {
        bot.logger.debug({text: res});
        if (res == undefined) {
          sendNoResults(bot, message);
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
          sendEmbed(bot, message, embed)
        } else {
          const model = res[0];
          // create embed
          let embed = {
            title: model.title || "unknown",
            description: model.content || "unknown",
            color: 0x00ff00,
            author: {
              name: model.discordUser || "unknown",
              icon_url: model.discordUserAvatar || "unknown",
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
            bot.getRESTUser(model.discordUserId).then((user: any) => {
              embed.author = {
                name: user.username,
                icon_url: user.avatarURL
              }
              sendEmbed(bot, message, embed);
            });
          } else {
            sendEmbed(bot, message, embed);
          }
        }
      });
    }
  } catch (err) {
    bot.logger.error({text: `[findmodelCmd] Error in findmodel:\n` + err});
    // @ts-ignore
    bot.logger.debug({text: err.stack});
    couldNotSendEmbed(bot, message);
    return;
  }
}