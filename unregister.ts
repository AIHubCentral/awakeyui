require("dotenv").config();

const Eris = require("eris");

const bot = new Eris(`Bot ${process.env.TOKEN}`, {});

bot.on("error", (err: any) => {
  console.error(err);
});

bot.on("ready", async () => {
  console.info(`Ready!`);
  // delete all registered commands
  console.log(`Getting all commands...`);
  await bot.getCommands().then(async (commands: any) => {
    console.log(`Got all commands`);
    for (const command of commands) {
      console.log(`Deleting command ${command.name}`);
      await bot.deleteCommand(command.id)
      console.log(`Deleted command ${command.name}`);
    }
  })
  console.log(`Deleted all commands`);
  process.exit(0);
});

console.info(`Connecting to Discord...`);
bot.connect().then(() => {
  console.info(`Connected!`);
});