const helperCheckModRole = require("./helpers/checkModRole");
const sendEmbed = require("./helpers/sendEmbed");
const sendInteractionEmbedEphemeral = require("./helpers/sendInteractionEmbedEphemeral");
const sendInteractionEmbed = require("./helpers/sendInteractionEmbed");

function checkForWhitelist(bot: any, url: string) {

  // load jsons/data/ppdfWhitelist.json
  const whitelist = JSON.parse(bot.fs.readFileSync('jsons/data/ppdfWhitelist.json', 'utf8'));

  // check if url is in whitelist, whitelist entries that end with * mean that every url that starts with the entry is whitelisted
  for (const entry of whitelist) {
    if (entry.endsWith("*")) {
      return url.startsWith(entry.replace("*", ""));
    } else if (entry.startsWith("*")) {
      return url.endsWith(entry.replace("*", ""));
    } else if (entry == url) {
      return true;
    }
  }
}

module.exports = (bot: any, interaction: any) => {
  let url: string = "";
  let pdf: boolean = false;
  for (const option of interaction.data.options) {
    if (option.name == "url") {
      url = option.value;
    } else if (option.name == "pdf") {
      pdf = option.value;
    }
  }

  bot.logger.debug({text: "[ppdfCmd] ppdf"});
  try {
    if (!checkForWhitelist(bot, url) && !helperCheckModRole(bot, interaction)) {
      sendInteractionEmbedEphemeral(bot, interaction, {
        color: 0xff0000,
        title: "Error",
        description: "This url is not whitelisted for ppdf. If you think this is a mistake, please contact a @sleepyyui."
      });
      return;
    } else {
      // add react to message
      interaction.acknowledge();
      (async () => {
        let pdfBuffer: Buffer;
        let pngBuffer: Buffer;
        try {
          // create new page
          bot.logger.debug({text: "[ppdfCmd] create new page"});
          const page = await bot.browser.newPage();
          // set viewport to 1920x1080
          bot.logger.debug({text: "[ppdfCmd] set viewport to 1920x1080"});
          await page.setViewport({width: 1920, height: 1080});
          // go to webpage
          bot.logger.debug({text: "[ppdfCmd] go to webpage"});
          await page.goto(url, {waitUntil: 'networkidle0'});
          // screenshot the page
          bot.logger.debug({text: "[ppdfCmd] screenshot the page"});
          await page.screenshot({path: 'ppdf/pageScreenshot.png'});
          if (pdf) {
            // create pdf
            bot.logger.debug({text: "[ppdfCmd] create pdf"});
            await page.pdf({
              path: 'ppdf/pagePDF.pdf',
              // 1920x1080 format
              height: '1080px',
              width: '1920px',
              scale: 1,
              landscape: false,
              printBackground: true,
              /*margin: {
                top: '100px',
                bottom: '100px',
                left: '50px',
                right: '50px'
              }*/
            });
          }

          // create buffer from pageScreenshot.png
          pngBuffer = bot.fs.readFileSync('ppdf/pageScreenshot.png');
          if (pdf) {
            // create buffer from pagePDF.pdf
            pdfBuffer = bot.fs.readFileSync('ppdf/pagePDF.pdf');

            try {
              // send pageScreenshot.png to channel
              interaction.createMessage({
                  content: "",
                },
                // send image and pdf as files
                [
                  {
                    file: pngBuffer,
                    name: "pageScreenshot.png"
                  },
                  {
                    file: pdfBuffer,
                    name: "pagePDF.pdf"
                  }
                ]
              );
            } catch (err) {
              bot.logger.error({text: `[ppdfCmd] Error in ppdf:\n` + err});
              // @ts-ignore
              bot.logger.debug({text: err.stack});

              sendInteractionEmbed(bot, interaction, bot.presets.embeds.ppdfError)
            }
          } else {
            // send pageScreenshot.png to channel
            interaction.createMessage({
                content: "",
              },
              // send image as file
              [
                {
                  file: pngBuffer,
                  name: "pageScreenshot.png"
                }
              ]
            );
          }

        } catch (err) {
          bot.logger.error({text: `[ppdfCmd] Error in ppdf:\n` + err});
          // @ts-ignore
          bot.logger.debug({text: err.stack});

          sendInteractionEmbed(bot, interaction, bot.presets.embeds.ppdfError)
        }

      })();
    }
  } catch (err) {
    bot.logger.error({text: `[ppdfCmd] Error in ppdf:\n` + err});
    // @ts-ignore
    bot.logger.debug({text: err.stack});

    sendInteractionEmbedEphemeral(bot, interaction, bot.presets.embeds.ppdfError)
  }
}