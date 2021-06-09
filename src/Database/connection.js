const { green, redBright } = require("chalk");
const mongoose = require("mongoose");
const config = require("../config");

//connecting database
mongoose
  .connect(config.mongoDB, {
    //options
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch(() =>
    console.log(redBright(`[ERROR]: Invalid MongoDB Connection String`))
  );

//logging
mongoose.connection.on("connected", () => {
  console.log(green(`[DATABASE]: Connected`));
});
