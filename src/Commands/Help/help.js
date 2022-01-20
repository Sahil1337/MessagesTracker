const chalk = require("chalk");
const { Message, MessageEmbed } = require("discord.js");
const { checkPermission } = require("../../Base/permission");
const { Bot } = require("../../Structures/Client");

module.exports = {
  help: {
    //command name
    name: "help",

    //command aliases
    aliases: ["h"],

    //permissions required for user
    permissions: ["NO PERMISSIONS"],

    //permissions required for client
    required: ["ADMINISTRATOR"],

    //command description
    description: `\`help\` command provides help for using commands!`,

    //command usage example
    usage: [`{prefix}help <Command:Optional>`],

    //command category
    category: "others",
  },
  /**
   *
   * @param { Bot } client
   * @param { Message } message
   * @param { String[] } args
   */
  run: async (client, message, args) => {
    try {
      //checking client permission
      let clientPermission = await checkPermission("client", message, [
        "ADMINISTRATOR",
      ]);
      if (clientPermission) return;

      //config
      const { config } = client;

      //client invite
      const inviteURL = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=20171494`;

      //if no arguments
      if (!args[0]) {
        //Messages Array
        let Messages = [];
        //Others Array
        let Others = [];

        //looping commands
        client.commands.forEach((command) => {
          if (command.help.category === "messages")
            Messages.push(`**\`${command.help.name}\`**`);

          if (command.help.category === "others")
            Others.push(`**\`${command.help.name}\`**`);
        });

        //embed
        return message.channel.send(
          new MessageEmbed()
            .setAuthor(
              client.user.username + "'s help panel",
              client.user.avatarURL({ dynamic: true })
            )
            .setFooter(
              message.member.user.tag + ` | ${config.Embed.footer}`,
              message.member.user.avatarURL({ dynamic: true })
            )
            .setColor(message.member.displayColor || config.Embed.Color)
            .setDescription(
              `Hey ${
                message.author.tag
              }, myself a advance messages tracking bot made by ${
                (await client.users.fetch("898037958995738624")).tag
              }. I have automated leaderboards , customisable commands , and very easy setup. You can get my source code from [here](${
                config.src
              })`
            )
            .addField(`🧾 Messages`, Messages.join(" , "))
            .addField(`🔍 Others`, Others.join(" , "))
            .addField(
              `Use \`${config.prefix}help <Command:Required>\` for more help about each command!`,
              "** **"
            )
            .addField(`📩 Invite Me`, `**[Link](${inviteURL})**`, true)
            .addField(`Source Code`, `**[Link](${config.src})**`, true)
        );
      }

      //finding command
      let command =
        (await client.commands.get(args[0])) ||
        client.commands.get(client.aliases.get(args[0]));

      //if command not found
      if (!command)
        return message.channel.send(
          new MessageEmbed()
            .setAuthor(
              message.author.tag,
              message.author.avatarURL({ dynamic: true })
            )
            .setColor(message.member.displayColor || config.Embed.Color)
            .setTimestamp()
            .setFooter(
              config.Embed.footer,
              client.user.avatarURL({ dynamic: true })
            )
            .setDescription(
              `${config.Embed.Denied} **__|__ Unable to find \`${
                args[0] || "Unknown"
              }\` command!**`
            )
        );

      //usage array
      let usage = [];

      //looping command usages to replace with prefix | Usefull for custom prefix
      command.help.usage.forEach((usages) => {
        usage.push(usages.split("{prefix}").join(config.prefix));
      });

      //embed
      message.channel.send(
        new MessageEmbed()
          .setAuthor(
            message.author.tag,
            message.author.avatarURL({ dynamic: true })
          )
          .setColor(message.member.displayColor || config.Embed.Color)
          .setTimestamp()
          .setFooter(
            config.Embed.footer,
            client.user.avatarURL({ dynamic: true })
          )
          .setDescription(`> **${command.help.description}**`)
          .addField(`📚 Usage`, `\`${usage.join("` **,** `")}\``, true)
          .addField(`📩 Category`, `\`${command.help.category}\``)
          .addField(
            `🚩 Shortcut(s)`,
            `\`${command.help.aliases.join("` **,** `")}\``
          )
          .addField(
            `💻 Permissions Required`,
            `\`${command.help.permissions.join("` **,** `").toLowerCase()}\``
          )
      );
    } catch (err) {
      console.log(
        chalk.redBright(
          `${err.stack} | ${message.guild.name} (${message.channel.name})`
        )
      );
    }
  },
};
