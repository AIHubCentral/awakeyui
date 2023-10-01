const fs = require('fs');

const helperCheckModRole = require("./helpers/checkmodrole");
const sendEmbed = require("./helpers/sendEmbed");

function checkForWhitelist(url: string) {

  // load jsons/data/ppdfWhitelist.json
  const whitelist = JSON.parse(fs.readFileSync('jsons/data/ppdfWhitelist.json', 'utf8'));

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

module.exports = (bot: any, message: any, url: string, pdf: boolean) => {
  bot.logger.debug({text: "[ppdfCmd] ppdf"});
  try {
    if (!checkForWhitelist(url) && !helperCheckModRole(bot, message)) {
      message.addReaction("❌");
      return;
    } else {
      // add react to message
      message.addReaction("🖨️");
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
          pngBuffer = fs.readFileSync('ppdf/pageScreenshot.png');
          if (pdf) {
            // create buffer from pagePDF.pdf
            pdfBuffer = fs.readFileSync('ppdf/pagePDF.pdf');

            try {
              // send pageScreenshot.png to channel
              bot.createMessage(message.channel.id, {
                  content: "",
                  messageReference: {messageID: message.id},
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

              sendEmbed(bot, message, bot.presets.embeds.ppdfError)
            }
          } else {
            // send pageScreenshot.png to channel
            bot.createMessage(message.channel.id, {
                content: "",
                messageReference: {messageID: message.id},
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

          sendEmbed(bot, message, bot.presets.embeds.ppdfError)
        }

      })();
    }
  } catch (err) {
    bot.logger.error({text: `[ppdfCmd] Error in ppdf:\n` + err});
    // @ts-ignore
    bot.logger.debug({text: err.stack});

    sendEmbed(bot, message, bot.presets.embeds.ppdfError);
  }
}