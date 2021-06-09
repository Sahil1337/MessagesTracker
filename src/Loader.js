const chalk = require("chalk");
const fs = require("fs");
const { Bot } = require("./Structures/Client");

/**
 *
 * @param { Bot } client
 */
async function loadCommands(client) {
  //folders
  let folders = await fs.readdirSync(`${__dirname}/Commands`);

  //looping each folders
  folders.forEach((folder) => {
    //looping files of folders
    fs.readdir(`${__dirname}/Commands/${folder}`, (err, files) => {
      //if error
      if (err)
        return console.log(
          chalk.redBright(
            `An Error Occured While Loading Commands. ${err.stack}`
          )
        );

      //if no files found in folder
      if (!files && !files.length)
        return console.log(
          chalk.yellowBright(
            `[WARN]: No Files Found In "${folder.toUpperCase()}" Dir`
          )
        );

      //looping over each files
      files.forEach((file) => {
        //props
        let props = require(`../src/Commands/${folder}/${file}`);

        //logging
        console.log(chalk.greenBright(`[LOADED]: ${file}`));

        /* Name */

        //if not enough properties
        if (!props.help || !props.help.name)
          return console.log(
            chalk.redBright(`[WARN]: ${file} not have enough help properties`)
          );

        //setting command
        client.commands.set(props.help.name, props);

        /* Aliases */

        //if not enough aliases
        if (!props.help.aliases)
          return console.log(
            chalk.redBright(`[WARN]: ${file} not have enough aliases!`)
          );

        //looping each aliases
        for (i = 0; i < props.help.aliases.length; i++) {
          client.aliases.set(props.help.aliases[i], props.help.name);
        }
      });
    });
  });
}

async function loadEvents(client) {
  //reading events folder
  fs.readdir(`${__dirname}/Events`, async (err, files) => {
    //if error
    if (err)
      return console.log(
        chalk.redBright(`An Error Occured While Loading Events. ${err.stack}`)
      );

    //if no files found
    if (!files)
      return console.log(
        chalk.redBright(`[WARN]: Events folder not have any files!`)
      );

    //looping each files
    for (i = 0; i < files.length; i++) {
      //Event
      const event = require(`../src/Events/${files[i]}`);

      //Event name
      let eventName = files[i].split(".")[0];

      //client
      client.on(eventName, event.bind(null, client));

      //logging
      console.log(chalk.greenBright(`[LOADED]: ${files[i]}`));
    }
  });
}

module.exports = {
  loadCommands,
  loadEvents,
};
