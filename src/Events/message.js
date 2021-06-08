const { Message } = require("discord.js");
const addMessages = require("../Base/message");
const { Bot } = require("../Structures/Client");

/**
 *
 * @param { Bot } client
 * @param { Message } message
 */
module.exports = async (client, message) => {
  //if not guild or message author is bot!
  if (!message.guild || message.author.bot) return;

  //config
  const { config } = client;

  //if content starts with prefix
  if (message.content.toLowerCase().startsWith(config.prefix)) {
    //if only prefix
    if (message.content === config.prefix) {
      await addMessages(client, message);
      return;
    }
    //arguments
    let args = message.content.slice(config.prefix.length).trim().split(/ +/g);

    //command argument
    let cmd = args.shift().toLowerCase();

    //if dm channel
    if (message.channel.type === "dm") return;

    //command
    let command =
      client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));

    //if invalid command , so just add message
    if (!command) await addMessages(client, message);

    //if valid command | not adding message
    if (command) command.run(client, message, args).catch(() => {});
  } else {
    //if content is not a command so add message
    addMessages(client, message);
  }
};
