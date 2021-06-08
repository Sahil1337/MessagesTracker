const { green } = require("chalk");
const { Bot } = require("../Structures/Client");

/**
 *
 * @param { Bot } client
 */
module.exports = (client) => {
  //logging
  console.log(
    green(
      `[API]: Logged as ${client.user.username} | ${client.config.Embed.footer}`
    )
  );
};
