

const allowMultipleTranscriptions = false;

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
      await interaction.acknowledge();
      // check if any of the files is an audio file
      const audioFiles = message.attachments.filter((attachment: any) => {
        //console.log(attachment);
        return attachment.content_type.startsWith("audio");
      });
      if (audioFiles.length > 0) {
        bot.logger.debug("Interaction has audio files!");
        let audioIndex = 0;
        for (const audioFile of audioFiles) {
          if (audioIndex > 0 && !allowMultipleTranscriptions) {
            interaction.createFollowup({
              content: "",
              embeds: [
                {
                  title: "Error",
                  description: "This message has multiple audio files, only the first one will be transcribed!",
                  color: 0xff0000,
                },
              ],
              flags: 1 << 6,
            });
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
                        interaction.createFollowup({
                          content: "",
                          embeds: [
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
                          ],
                        })
                      }
                    ).catch((err: any) => {
                      bot.logger.error(err);
                      interaction.createFollowup({
                        content: "",
                        embeds: [
                          {
                            title: "Transcription (truncated)",
                            description: transcriptionText.substring(0, 4096),
                            color: 0x4a8aff,
                          },
                        ],
                      });
                    });
                  } else {
                    interaction.createFollowup({
                      content: "",
                      embeds: [
                        {
                          title: "Transcription",
                          description: transcription.text,
                          color: 0x4a8aff,
                        },
                      ],
                    });
                  }
                }).catch((err: any) => {
                  bot.logger.error(err);
                interaction.createFollowup({
                  content: "",
                  embeds: [
                    {
                      title: "Error",
                      description: "An error occurred while transcribing the audio file!",
                      color: 0xff0000,
                    },
                  ],
                  flags: 1 << 6,
                });
              });
            }).catch((err: any) => {
            bot.logger.error(err);
            interaction.createFollowup({
              content: "",
              embeds: [
                {
                  title: "Error",
                  description: "An error occurred while transcribing the audio file!",
                  color: 0xff0000,
                },
              ],
              flags: 1 << 6,
            });
          });
        }
      } else {
        bot.logger.debug("Interaction has no audio files!");
        return interaction.createMessage({
          content: "",
          embeds: [
            {
              title: "No Audio Files",
              description: "This message has no audio files!",
              color: 0xff0000,
            },
          ],
          flags: 1 << 6,
        })
      }
    } else {
      bot.logger.debug("Interaction has no files!");
      return interaction.createMessage({
        content: "",
        embeds: [
          {
            title: "No Files",
            description: "This message has no files!",
            color: 0xff0000,
          },
        ],
        flags: 1 << 6,
      })
    }
  } catch (err: any) {
    bot.logger.error(err);
  }
}

module.exports = {
  transcribeAudioFile,
}
