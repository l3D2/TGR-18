const mongoose = require("mongoose");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const config = {
  host: process.env.MONGO_HOST,
  port: process.env.MONGO_PORT,
  username: process.env.MONGO_USERNAME,
  password: process.env.MONGO_PASSWORD,
};
const uri = `mongodb://${config.username}:${config.password}@${config.host}:27018/TGR18?authSource=admin`;
const connect = async () => {
  console.log(uri);
  try {
    await mongoose.connect(uri);
    console.log("Connected to TGR18 database successfully");
  } catch (error) {
    console.error("Error connecting to TGR18 database:", error);
  }
};

const disconnect = async () => {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from TGR18 database successfully");
  } catch (error) {
    console.error("Error disconnecting from TGR18 database:", error);
  }
};

module.exports = { connect, disconnect };
