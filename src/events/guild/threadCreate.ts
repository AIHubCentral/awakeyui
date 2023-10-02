const wggapi = require("../../commands/helpers/wggapi");

module.exports = async (bot: any, thread: any) => {
  try {
    bot.logger.debug({text: "Thread created!"});
    bot.logger.debug({text: thread.type});

    // dump thread to ./thread.json
    bot.fs.writeFileSync("./thread.json", JSON.stringify(thread, null, 2));

    if (thread.type === 11 && thread.parentID == bot.cfx.requestModelChannel && !bot.lists.createdRequestThreads.includes(thread.id)) {

      // check if

      bot.logger.debug({text: "Thread is a forum post in request-models!"});

      bot.lists.createdRequestThreads.push(thread.id);

      // join thread
      thread.join();

      // thread name
      let threadName = thread.name;
      threadName = threadName.split(" ");
      threadName.push("--sort");
      threadName.push("Likes");
      const wggResult = await wggapi.getModel(bot, threadName, 50);

      bot.logger.debug({text: wggResult});
      if (wggResult.length == 0) {
        // send message into thread
        /*try {
          thread.createMessage({
            content: `**No Similar Models Found**`,
            embed: {
              title: "No Similar Models Found",
              description: `**No similar models were found on [Weights.gg](https://www.weights.gg/)**`,
              color: 0xffffff,
              footer: {
                text: "Footer",
              }
            },
            components: [
              {
                type: 1,
                components: [
                  {
                    type: 2,
                    style: 4,
                    label: "Delete this message",
                    custom_id: "request_deny_" + thread.id,
                  },
                  {
                    type: 2,
                    style: 5,
                    label: "All Models",
                    url: "https://www.weights.gg/",
                  },
                ],
              },
            ]
          });
        } catch (err) {
          bot.logger.error({text: `Could not send embed:\n` + err});
          // @ts-ignore
          bot.logger.debug({text: err.stack});
          return;
        }*/
        return;
      }
      // send message into thread
      try {
        thread.createMessage({
          content: `**Found ${(wggResult.length !== 10 ? wggResult.length : "10 Or More")} Similar Model${wggResult.length !== 1 ? "s" : ""}**`,
          embed: {
            title: wggResult[0].simplifiedTitle,
            description: `**Uploaded at** <t:${(Math.floor(Date.parse(wggResult[0].createdAt).valueOf() / 1000))}:R>\n**Download from** [${wggResult[0].url.split("/")[2]}](${wggResult[0].url})`,
            author: {
              name: wggResult[0].discordUser,
              icon_url: (await bot.getRESTUser(wggResult[0].discordUserId)).avatarURL,
            },
            fields: [
              {
                name: "Author",
                value: wggResult[0].discordUser || "unknown",
                inline: true,
              },
              {
                name: "Likes",
                value: wggResult[0]._count.Likes || "unknown",
                inline: true,
              },
              {
                name: "Downloads",
                value: wggResult[0]._count.Downloads || "unknown",
                inline: true,
              },
              {
                name: "Epochs",
                value: wggResult[0].epochs || "unknown",
                inline: true,
              }
            ],
            image: {
              url: wggResult[0].image || undefined,
            },
            color: 0xffffff,
            /*footer: {
              text: "Weights.gg",
            }*/
          },
          components: [
            {
              type: 1,
              components: [
                {
                  type: 2,
                  style: 1,
                  label: "Accept",
                  custom_id: "request_accept_" + thread.id,
                },
                {
                  type: 2,
                  style: 4,
                  label: "Deny",
                  custom_id: "request_deny_" + thread.id,
                },
              ],
            },
            {
              type: 1,
              components: [
                {
                  type: 2,
                  style: 5,
                  label: "This Model",
                  url: "https://www.weights.gg/models/" + wggResult[0].id,
                },
                {
                  type: 2,
                  style: 5,
                  label: "All Models",
                  url: "https://www.weights.gg/",
                },
              ],
            }
          ]
        })
      } catch (err) {
        bot.logger.error({text: `Could not send embed:\n` + err});
        // @ts-ignore
        bot.logger.debug({text: err.stack});
        return;
      }
    }
  } catch (err) {
    bot.logger.error({text: `Could not handle threadCreate event:\n` + err});
    // @ts-ignore
    bot.logger.debug({text: err.stack});
    return;
  }
}