const fs = require('fs');
const puppeteer = require('puppeteer');

module.exports = (bot: any, message: any, url: string, pdf: boolean) => {
  bot.logger.debug({text: "[ppdfCmd] ppdf"});
  try {
    // add react to message
    message.addReaction("🖨️");
    (async () => {
      let pdfBuffer: Buffer;
      let pngBuffer: Buffer;
      try {
        // create new page
        bot.logger.debug({text: "[ppdfCmd] create new page"});
        const page = await bot.browser.newPage();
        // go to webpage
        bot.logger.debug({text: "[ppdfCmd] go to webpage"});
        await page.goto(url, {waitUntil: 'networkidle0'});
        // set viewport to 1920x1080
        bot.logger.debug({text: "[ppdfCmd] set viewport to 1920x1080"});
        await page.setViewport({width: 1920, height: 1080});
        // screenshot the page
        bot.logger.debug({text: "[ppdfCmd] screenshot the page"});
        await page.screenshot({path: 'ppdf/pageScreenshot.png'});
        if (pdf) {
          // set viewport to pdf DIN A4 format
          bot.logger.debug({text: "[ppdfCmd] set viewport to pdf DIN A4 format"});
          await page.setViewport({width: 3508, height: 2480});
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
                content: "🖥️",
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

            bot.createMessage(message.channel.id, {
              content: "Error in ppdf, files too big?",
              messageReference: {messageID: message.id}
            });
          }
        } else {
          // send pageScreenshot.png to channel
          bot.createMessage(message.channel.id, {
              content: "🖥️",
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

        bot.createMessage(message.channel.id, {
          content: "Error in ppdf",
          messageReference: {messageID: message.id}
        });
      }

    })();
  } catch (err) {
    bot.logger.error({text: `[ppdfCmd] Error in ppdf:\n` + err});
    // @ts-ignore
    bot.logger.debug({text: err.stack});

    bot.createMessage(message.channel.id, {
      content: "Error in ppdf",
      messageReference: {messageID: message.id}
    });
  }
}