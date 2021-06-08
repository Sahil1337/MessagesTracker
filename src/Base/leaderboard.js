const { Guild } = require("discord.js");
const { Bot } = require("../Structures/Client");

/**
 * @param { Bot } client
 * @param { Guild } _guild
 * @returns { Array }
 */

async function getMessagesArray(client, _guild) {
  //fetching messages data
  let Messages = await client.User.find({ guild: _guild.id })
    .sort([["messages", "Descending"]])
    .exec();

  //array
  let array = [];

  //looping the data
  for (let i = 0; i < Messages.length; i++) {
    //breaking loop after 10 , as we only need top 10 users
    if (array.length >= 10) break;

    //fetching user
    let user = _guild.members.cache.get(Messages[i].user);

    //if user found , to avoid the users who left guild
    if (user) {
      //pushing into array
      array.push({
        User: user.toString(),
        Messages: Messages[i].messages,
      });
    }
  }

  //returning the array
  return array;
}

module.exports = getMessagesArray;
