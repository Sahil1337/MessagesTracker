const { Message } = require("discord.js");
const { Bot } = require("../Structures/Client");

/**
 *
 * @param { Bot } client
 * @param { Message } message
 */
async function addMessages(client, message) {
  try {
    //fetching database
    const Database = await client.User.findOne({
      guild: message.guild.id,
      user: message.author.id,
    });

    //if no database found!
    if (!Database) {
      //new document
      let doc = new client.User({
        user: message.author.id,
        guild: message.guild.id,
        messages: 1,
      });
      //saving document
      await doc.save();
      return;
    } else {
      //increment in messages
      Database.messages++;
      //saving doc
      await Database.save();
    }
  } catch (err) {
    console.log(
      chalk.redBright(
        `${err.stack} | ${message.guild.name} (${message.channel.name})`
      )
    );
  }
}

module.exports = addMessages;
