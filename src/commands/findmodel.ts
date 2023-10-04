const hfapi = require('./helpers/hfapi');
const wggapi = require('./helpers/wggapi');
const cvapi = require('./helpers/cvapi');

const sendFindModelHf = require('./helpers/sendFindModelHf');
const sendFindModelWgg = require('./helpers/sendFindModelWgg');
const sendFindModelCv = require('./helpers/sendFindModelCv');

const sendInteractionEmbedEphemeral = require('./helpers/sendInteractionEmbedEphemeral');

module.exports = async (bot: any, interaction: any) => {
  try {
    let queryObject = {
      sort: undefined as string | undefined,
      author: undefined as string | undefined,
      filter: undefined as string | undefined,
      query: undefined as Array<string> | undefined,
      // temporary, remove when released
      limit: undefined as number | undefined,
    };

    // idk, future me finds a better option
    queryObject.limit = process.env.FIND_LIMIT ? parseInt(process.env.FIND_LIMIT) : 10;

    let site: string = "";

    for (const option of interaction.data.options) {
      bot.logger.debug({text: option});
      switch (option.name) {
        case "site":
          site = option.value;
          break;
        case "sort":
          queryObject.sort = option.value;
          break;
        case "author":
          queryObject.author = option.value;
          break;
        case "filter":
          queryObject.filter = option.value;
          break;
        case "query":
          queryObject.query = option.value.split(" ");
          break;
        case "limit":
          queryObject.limit = option.value;
          break;
      }
    }


    if (!["wgg", "hf", "cv"].includes(site)) {
      bot.logger.debug({text: "site not defined"});
      sendInteractionEmbedEphemeral(bot, interaction, bot.presets.embeds.findSiteInvalidSite).then(() => {
        return;
      }).catch((err: any) => {
        bot.logger.error({text: err});
        return;
      });
    } else {
      bot.logger.debug({text: "site defined"});
      switch (site) {
        case "wgg":
          bot.logger.debug({text: "wgg"});
          wggapi.getModel(bot, queryObject).then((res: any) => {
            sendFindModelWgg(bot, interaction, res);
          });
          break;
        case "hf":
          bot.logger.debug({text: "hf"});
          hfapi.getModel(bot, queryObject).then((res: any) => {
            sendFindModelHf(bot, interaction, res);
          });
          break;
        case "cv":
          bot.logger.debug({text: "cv"});
          cvapi.getModel(bot, queryObject).then((res: any) => {
            sendFindModelCv(bot, interaction, res);
          });
          break;
        default:
          bot.logger.debug({text: "default"});
          sendInteractionEmbedEphemeral(bot, interaction, bot.presets.embeds.findSiteInvalidSite).then(() => {
            return;
          }).catch((err: any) => {
            bot.logger.error({text: err});
            return;
          });
      }
    }
  } catch (err: any) {
    bot.logger.error({text: `Error in findmodel:\n` + err});
    // @ts-ignore
    bot.logger.debug({text: err.stack});
  }
}