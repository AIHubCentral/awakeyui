require("dotenv").config();

const Eris = require("eris");

const bot = new Eris(`Bot ${process.env.TOKEN}`, {});

bot.on("error", (err: any) => {
  console.error(err);
});

bot.on("ready", () => {
  console.info(`Ready!`);
  // delete all registered commands
  console.log(`Deleting all commands...`);
  bot.getpplicationCommands().then((commands: any) => {
    commands.forEach((command: any) => {
      bot.deleteGuildApplicationCommand(process.env.GUILD_ID, command.id).then(() => {
        console.log(`Deleted command ${command.name}`);
      }).catch((err: any) => {
        console.error(err);
      });
    });
  }).catch((err: any) => {
    console.error(err);
  });
  console.log(`Deleted all commands`);
});

console.info(`Connecting to Discord...`);
bot.connect().then(() => {
  console.info(`Connected!`);
});