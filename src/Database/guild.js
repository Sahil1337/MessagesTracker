const { Schema, model } = require("mongoose");

//Guild Schema
const Guild = new Schema({
  //guild id
  _id: String,

  //Loggers
  Loggers: {
    //Leaderboard Object
    Leaderboard: {
      //LastMessage
      LastMessage: String,
      //Channel
      Channel: String,
    },
  },
});

module.exports = model("Guild", Guild);
