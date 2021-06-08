const { green } = require("chalk");
const mongoose = require("mongoose");
const config = require("../config");

//connecting database
mongoose.connect(config.mongoDB, {
  //options
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//logging
mongoose.connection.on("connected", () => {
  console.log(green(`[DATABASE]: Connected`));
});
