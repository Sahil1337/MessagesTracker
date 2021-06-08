const chalk = require("chalk");
const { Message, MessageEmbed, MessageReaction } = require("discord.js");
const { checkPermission } = require("../../Base/permission");
const config = require("../../config");
const { Bot } = require("../../Structures/Client");

module.exports = {
  help: {
    //command name
    name: "leaderboard",

    //command aliases
    aliases: ["lb", "top"],

    //permissions required for user
    permissions: ["NO PERMISSIONS"],

    //permissions required for client
    required: ["SEND_MESSAGES", "EMBED_LINKS"],

    //command description
    description: `\`leaderboard\` command shows the messages leaderboard!`,

    //command usage example
    usage: [`{prefix}leaderboard <Page:Optional>`],

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

      //fetching Database
      let Database = await client.User.find({ guild: message.guild.id })

        //sorting data
        .sort([["messages", "Descending"]])
        .exec();

      //if database not found
      if (!Database || !Database.length)
        return message.channel.send(
          new MessageEmbed()
            .setAuthor(
              message.author.tag,
              message.author.avatarURL({ dynamic: true })
            )
            .setColor(message.member.displayColor || client.config.Embed.Color)
            .setFooter(
              client.config.Embed.footer,
              client.user.avatarURL({ dynamic: true })
            )
            .setDescription(
              `${client.config.Embed.Stuck} **No data to show leaderboard!**`
            )
        );

      //array
      let array = [];

      //looping data
      for (i = 0; i < Database.length; i++) {
        //fetching user
        let user = message.guild.members.cache.get(Database[i].user);

        //if user found , to avoid the users who left guild
        if (user) {
          //pushing into array
          array.push({
            User: user.toString(),
            Messages: Database[i].messages,
          });
        }
      }

      //if no users
      if (!array.length)
        return message.channel.send(
          new MessageEmbed()
            .setAuthor(
              message.author.tag,
              message.author.avatarURL({ dynamic: true })
            )
            .setColor(message.member.displayColor || client.config.Embed.Color)
            .setFooter(
              client.config.Embed.footer,
              client.user.avatarURL({ dynamic: true })
            )
            .setDescription(
              `${client.config.Embed.Stuck} **No data to show leaderboard!**`
            )
        );

      //if less than 10 users
      if (array.length <= 10) {
        //index
        let index = 1;

        //embed
        return message.channel.send(
          new MessageEmbed()
            .setAuthor(
              message.guild.name + "'s messages leaderboard",
              message.guild.iconURL({ dynamic: true })
            )
            .setColor(message.member.displayColor || client.config.Embed.Color)
            .setFooter(
              client.config.Embed.footer + " | Page: 1/1",
              client.user.avatarURL({ dynamic: true })
            )
            .setImage(
              `https://media.discordapp.net/attachments/612201812262649867/760335107394371624/divider1-1.gif`
            )
            .setDescription(
              array.map(
                (db) =>
                  `\`${index++}.\` ${db.User}・**${db.Messages}** messages`
              )
            )
        );
      }

      //if more than 10 users so pages/finding with index
      else if (array.length > 10) {
        //leaderboard | with 10 users each page
        const Leaderboard = await fetchLeaderboard(array);

        //temp array
        let Arr = [];

        //index
        let index = 1;

        //looping
        for (Users of Leaderboard) {
          //description
          const description = Users.map(
            (db) => `\`${index++}.\` ${db.User}・**${db.Messages}** message(s)`
          );
          //pushing with embed to temp array
          Arr.push(
            new MessageEmbed()
              .setAuthor(
                message.guild.name + "'s messages leaderboard",
                message.guild.iconURL({ dynamic: true })
              )
              .setFooter(
                client.config.Embed.footer,
                client.user.avatarURL({ dynamic: true })
              )
              .setColor(
                message.member.displayColor || client.config.Embed.Color
              )
              .setTimestamp()
              .setDescription(description)
              .setImage(
                `https://media.discordapp.net/attachments/612201812262649867/760335107394371624/divider1-1.gif`
              )
          );
        }

        //if no args
        if (!args[0] || isNaN(args[0])) return await Pages(message, Arr);

        //if args , so finding page and sending
        if (args[0]) return await SendPage(message, Arr, args[0]);
      }
    } catch (err) {
      console.log(
        chalk.redBright(
          `${err.stack} | ${message.guild.name} (${message.channel.name})`
        )
      );
    }
  },
};

/**
 *
 * @param { Array } data
 * @returns { Array }
 */
async function fetchLeaderboard(data) {
  //result array
  const result = [];

  //looping data and breaking into pages
  for (let i = 0; i < data.length; i += 10) {
    //pushing page
    result.push(data.slice(i, i + 10));
  }

  //returning pages array
  return result;
}

/**
 *
 * @param { Message } message
 * @param { Array } pages
 * @param { String } number
 */

async function SendPage(message, pages, number) {
  //checking message & channel
  if (!message && !message.channel)
    throw new Error("Unable to access channel....");

  //checking pages
  if (!Pages) throw new Error("Unable to access pages...");

  //embed
  let embed = pages[parseInt(number - 1)];

  //if page not found
  if (!embed)
    return message.channel.send(
      new MessageEmbed()
        .setAuthor(
          message.author.tag,
          message.author.avatarURL({ dynamic: true })
        )
        .setFooter(
          message.client.config.Embed.footer,
          message.client.user.avatarURL({ dynamic: true })
        )
        .setColor(message.member.displayColor || client.config.Embed.Color)
        .setTimestamp()
        .setDescription(`${config.Embed.Stuck} | Page not found!`)
    );

  //if embed found , so set footer & send
  embed.setFooter(
    config.Embed.footer + ` | Page: ${number}/${pages.length}`,
    message.client.user.avatarURL({ dynamic: true })
  );

  //sending embed
  message.channel.send(embed);
}

/**
 *
 * @param { Message } msg
 * @param { Array } pages
 * @param { Number } timeout
 * @param { String[] } emojiList
 */
async function Pages(
  msg,
  pages,
  timeout = 120000,
  emojiList = ["⏮️", "◀️", "⏹️", "▶️", "⏭️"]
) {
  //page
  let page = 0;

  //current page
  const current = await msg.channel.send(
    pages[page].setFooter(
      config.Embed.footer + ` | Page: ${page + 1}/${pages.length}`,
      msg.client.user.avatarURL({ dynamic: true })
    )
  );

  //reaction collector
  const reactionCollector = current.createReactionCollector(
    (reaction, user) =>
      emojiList.includes(reaction.emoji.name) && user.id === msg.author.id,
    { time: timeout }
  );

  //reacting emojis
  for (const emoji of emojiList) await current.react(emoji);

  //collector
  reactionCollector.on("collect", (reaction) => {
    //removing author reaction
    reaction.users.remove(msg.author.id);

    //pages editing
    switch (reaction.emoji.name) {
      case emojiList[0]:
        page = 0;
        break;
      case emojiList[1]:
        page = page > 0 ? --page : pages.length - 1;
        break;
      case emojiList[2]:
        curPage.reactions.removeAll();
        break;
      case emojiList[3]:
        page = page + 1 < pages.length ? ++page : 0;
        break;
      case emojiList[4]:
        page = pages.length - 1;
        break;
      default:
        break;
    }

    //editing footer
    current.edit(
      pages[page].setFooter(
        config.Embed.footer + ` | Page: ${page + 1}/${pages.length}`,
        msg.client.user.avatarURL({ dynamic: true })
      )
    );
  });

  //collector end
  reactionCollector.on("end", () => {
    //removing all reactions
    current.reactions.removeAll().catch(() => {});
  });
}
