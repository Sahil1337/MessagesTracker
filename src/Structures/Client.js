const chalk = require("chalk");
const { Client, Collection, Message, TextChannel } = require("discord.js");
const { loadCommands, loadEvents } = require("../Loader");
const Leaderboard = require("./Leaderboard");

class Bot extends Client {
  /**
   * @param { import("discord.js").ClientOptions } props;
   */
  constructor(props) {
    if (!props) props = {};
    //partials
    props.partials = ["MESSAGE", "CHANNEL", "REACTION"];
    super(props);
  }
  //init function
  _init() {
    //bot config
    this.config = require("../config");

    //if no bot token provided
    if (!this.config.token)
      return console.log(
        chalk.redBright(`[ERROR]: Token not found in config file!`)
      );

    //checking developers
    if (!this.config.devs.length)
      return console.log(chalk.redBright(`[ERROR]: No devs..??`));

    //initialising database
    require("../Database/connection.js");

    //commands
    this.commands = new Collection();

    //aliases
    this.aliases = new Collection();

    //User model
    this.User = require("../Database/user.js");

    //Guild model
    this.Guild = require("../Database/guild.js");

    //initialising commands
    loadCommands(this);

    //initialising events
    loadEvents(this);

    //initialising leaderboard class with edit method
    new Leaderboard(this).startLeaderboard("edit");

    //login
    this.login(this.config.token).catch(() => {
      console.log(chalk.redBright(`[ERROR]: Invalid token provided!`));
    });
  }

  /**
   * @param { TextChannel } channel
   * @returns { Message }
   */
  async findMessage(id, channel) {
    //checking id and channel
    if (!id || !channel) throw new Error("Invalid MessageID/Channel");

    //checking if <channel> instanceof TextChannel
    if (!channel instanceof TextChannel) throw new Error("Invalid Channel");

    //fetching message
    let fetchedMessage = await channel.messages.fetch(id).catch(() => {});

    //returning output!
    return fetchedMessage;
  }

  /**
   * @param { Message } message
   */
  async setLastMessage(message) {
    //checking message
    if (!message) throw new Error("No message provided...??");

    //fetching Database
    let Database = await this.Guild.findById(message.guild.id);

    //overwriting
    if (Database) {
      Database.Loggers.Leaderboard.LastMessage = message.id;
      await Database.save();
    }
  }
}

module.exports.Bot = Bot;
