// ℹ️ package responsible to make the connection with mongodb
// https://www.npmjs.com/package/mongoose
const mongoose = require("mongoose");

// ℹ️ Sets the MongoDB URI for our app to have access to it.
// If no env has been set, we dynamically set it to whatever the folder name was upon the creation of the app

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost/To-Do-List";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });

  
//From: https://www.makeuseof.com/user-authentication-in-nodejs/
/* const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const dbUrl = "mongodb://localhost/To-Do-List";
const connect = async () => {
  mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = mongoose.connection;
  db.on("error", () => {
    console.log("could not connect");
  });
  db.once("open", () => {
    console.log("> Successfully connected to database");
  });
};
module.exports = { connect }; */