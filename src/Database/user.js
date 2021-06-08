const { Schema, model } = require("mongoose");

//User schema
const User = new Schema({
  //user id
  user: String,

  //guild id
  guild: String,

  //messages
  messages: Number,
});

module.exports = model("User", User);
