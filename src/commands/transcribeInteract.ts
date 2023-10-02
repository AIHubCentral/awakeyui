const sendEmbed = require("./helpers/sendInteractionEmbed");
const sendEmbeds = require("./helpers/sendInteractionEmbeds");
const sendEmbedEphemeral = require("./helpers/sendInteractionEmbedEphemeral");

async function getAudioStream(bot: any, url: string) {
  try {
    const response = await bot.axios.get(url, {responseType: 'stream'});

    if (response.status !== 200) {
      throw new Error(`Failed to fetch audio, status code: ${response.status}`);
    }

    const filePath = bot.path.join(__dirname, 'audio', 'file.mp3');
    const fileStream = bot.fs.createWriteStream(filePath);

    response.data.pipe(fileStream);

    await new Promise((resolve, reject) => {
      fileStream.on('finish', resolve);
      fileStream.on('error', reject);
    });

    const audioReadStream = bot.fs.createReadStream(filePath);

    return audioReadStream;
  } catch (error: any) {
    bot.logger.error({text: "Error fetching audio:"});
    bot.logger.error({text: error.message});
    throw error;
  }
}

function censorBannedWords(bot: any, text: string) {
  for (const word of bot.bannedWords) {
    text = text.replace(word, word.length > 1 ? "*".repeat(word.length) : "*");
  }
  return text;
}

async function transcribeAudioFile(bot: any, interaction: any) {
  try {
    bot.logger.debug("Transcribe Interaction received!");
    //console.log(interaction.data);
    const message = interaction.data?.resolved?.messages?.get(interaction.data.target_id);
    //console.log(message);
    // check if interaction has any files
    if (message.attachments.length > 0) {
      bot.logger.debug("Interaction has files!");
      // check if any of the files is an audio file
      const audioFiles = message.attachments.filter((attachment: any) => {
        //console.log(attachment);
        return attachment.content_type.startsWith("audio");
      });
      if (audioFiles.length > 0) {
        bot.logger.debug("Interaction has audio files!");
        await interaction.acknowledge();
        let audioIndex = 0;
        for (const audioFile of audioFiles) {
          if (audioIndex > 0 && !bot.cfx.allowMultipleTranscriptions) {
            sendEmbed(bot, interaction, bot.presets.embeds.transcribeMultipleAudioFiles);
            break;
          }
          audioIndex++;
          bot.logger.debug("Processing audio file...");
          //console.log(audioFile);
          // get read stream from audioFile
          getAudioStream(bot, audioFile.url)
            .then((stream: any) => {
              //console.log(stream);
              // send readStream to OpenAI
              bot.logger.debug("Sending audio to OpenAI...");
              bot.openai.audio.transcriptions.create({
                file: stream,
                model: "whisper-1",
              })
                .then((transcription: any) => {
                  bot.logger.debug(transcription);
                  // send transcription to channel
                  let transcriptionText = transcription.text;
                  // censor banned words
                  transcriptionText = censorBannedWords(bot, transcriptionText);
                  // check if transcription is longer than 4096 characters
                  if (transcriptionText.length > 4096) {
                    // add transcription to hastebin
                    bot.axios.post("https://hastebin.com/documents", transcriptionText).then(
                      (response: any) => {
                        // truncate transcription
                        transcriptionText = transcriptionText.substring(0, 4096);
                        // send transcription to channel
                        sendEmbeds(bot, interaction, [
                          {
                            title: "Transcription (truncated)",
                            description: transcriptionText,
                            color: 0x4a8aff,
                          },
                          {
                            title: "Full Transcription",
                            description: `https://hastebin.com/share/${response.data.key}`,
                            color: 0x0000ff,
                          },
                        ]);
                      }
                    ).catch((err: any) => {
                      bot.logger.error(err);
                      sendEmbed(bot, interaction, {
                        title: "Transcription (truncated)",
                        description: transcriptionText.substring(0, 4096),
                        color: 0x4a8aff,
                      })
                    });
                  } else {
                    sendEmbed(bot, interaction, {
                      title: "Transcription",
                      description: transcription.text,
                      color: 0x4a8aff,
                    })
                  }
                }).catch((err: any) => {
                bot.logger.error(err);
                sendEmbed(bot, interaction, bot.presets.embeds.transcribeAudioError)
              });
            }).catch((err: any) => {
            bot.logger.error(err);
            sendEmbed(bot, interaction, bot.presets.embeds.transcribeAudioError)
          });
        }
      } else {
        bot.logger.debug("Interaction has no audio files!");
        return sendEmbedEphemeral(bot, interaction, bot.presets.embeds.transcribeNoAudioFiles)
      }
    } else {
      bot.logger.debug("Interaction has no files!");
      return sendEmbedEphemeral(bot, interaction, bot.presets.embeds.transcribeNoFiles)
    }
  } catch (err: any) {
    bot.logger.error(err);
  }
}

module.exports = transcribeAudioFile
