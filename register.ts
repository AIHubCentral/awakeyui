require("dotenv").config();

const Eris = require("eris");
const Constants = Eris.Constants;

const bot = new Eris(`Bot ${process.env.TOKEN}`, {});

const commandsList = [
  {
    name: "Transcribe",
    type: Constants.ApplicationCommandTypes.MESSAGE,
  },
  {
    name: "ping",
    description: "Pong! Returns the bot's latency.",
    type: Constants.ApplicationCommandTypes.CHAT_INPUT,
  },
  {
    name: "find",
    description: "Find a model on Civitai, Weights.gg or Huggingface.",
    options: [
      {
        name: "query",
        description: "The name of the model to search for.",
        type: Constants.ApplicationCommandOptionTypes.STRING,
        required: true,
      },
      {
        name: "author",
        description: "The author of the model to search for.",
        type: Constants.ApplicationCommandOptionTypes.STRING,
        required: false,
      },
      {
        name: "sort",
        description: "The sorting method to use.",
        type: Constants.ApplicationCommandOptionTypes.STRING,
        required: false,
        choices: [
          {
            name: "Downloads",
            value: "downloads",
          },
          {
            name: "Author",
            value: "author",
          },
          {
            name: "Name",
            value: "name",
          },
          {
            name: "Created",
            value: "created",
          },
          {
            name: "Updated",
            value: "updated",
          },
          {
            name: "Size",
            value: "size",
          },
          {
            name: "Epochs",
            value: "epochs",
          },
          {
            name: "Likes",
            value: "likes",
          },
          {
            name: "Rating",
            value: "rating",
          },
          {
            name: "Newest",
            value: "newest",
          },
        ],
      },
      {
        name: "filter",
        description: "The filter to use.",
        type: Constants.ApplicationCommandOptionTypes.STRING,
        required: false,
      }
    ],
    type: Constants.ApplicationCommandTypes.CHAT_INPUT,
  },
  {
    name: "ppdf",
    description: "Generate an image/pdf from a URL.",
    options: [
      {
        name: "url",
        description: "The URL to generate an image/pdf from.",
        type: Constants.ApplicationCommandOptionTypes.STRING,
        required: true,
      },
      {
        name: "pdf",
        description: "Whether to generate a pdf or not.",
        type: Constants.ApplicationCommandOptionTypes.BOOLEAN,
        required: false,
      },
    ],
    type: Constants.ApplicationCommandTypes.CHAT_INPUT,
  }
];

bot.on("error", (err: any) => {
  console.error(err);
});

bot.on("ready", async () => {
  console.info(`Ready!`);
  // register app command for messages
  console.log(`Registering commands...`);
  for (const command of commandsList) {
    console.log(`Registering command ${command.name}`);
    await bot.createCommand(command);
    console.log(`Registered command ${command.name}`);
  }

  console.log(`Registered all commands`);
  process.exit(0);
});

console.info(`Connecting to Discord...`);
bot.connect().then(() => {
  console.info(`Connected!`);
});