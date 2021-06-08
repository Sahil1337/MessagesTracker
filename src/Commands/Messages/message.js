const chalk = require("chalk");
const { Message, MessageEmbed } = require("discord.js");
const { checkPermission } = require("../../Base/permission");
const { Bot } = require("../../Structures/Client");

module.exports = {
  help: {
    //command name
    name: "messages",

    //command aliases
    aliases: ["message"],

    //permissions required for user
    permissions: ["NO PERMISSIONS"],

    //permissions required for client
    required: ["SEND_MESSAGES", "EMBED_LINKS"],

    //command description
    description: `\`messages\` command shows how many messages you currently have!`,

    //command usage example
    usage: [`{prefix}messages <user:Optional>`],

    //command category
    category: "messages",
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

      //member
      let member =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]) ||
        message.member;

      //fetching Database
      let Database = await client.User.findOne({
        guild: message.guild.id,
        user: member.id,
      });

      //if no database
      if (!Database || !Database.messages) {
        Database = {
          messages: 0,
        };
      } else {
        //if database
        Database.messages = Database.messages;
      }

      //fetching leaderboard
      let Leaderboard = await client.User.find({ guild: message.guild.id })
        .sort([["messages", "Descending"]])
        .exec();

      //User position in leaderboard
      let Position = Leaderboard.findIndex(
        (Member) => Member.user === member.id
      );

      //embed
      message.channel.send(
        new MessageEmbed()
          .setAuthor(
            message.author.tag,
            message.author.avatarURL({ dynamic: true })
          )
          .setFooter(
            client.config.Embed.footer,
            client.user.avatarURL({ dynamic: true })
          )
          .setDescription(`Showing information of ${member.user.tag}`)
          .addField(`✉ Messages`, `**${Database.messages}**`, true)
          .addField(`🎖 Position`, `**${Position + 1 || "Unknown"}**`, true)
          .setColor(message.member.displayColor || client.config.Embed.Color)
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
