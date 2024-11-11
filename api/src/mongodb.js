const mongoose = require("mongoose");
require("dotenv").config();

const config = {
  host: process.env.MONGO_HOST,
  port: process.env.MONGO_PORT,
  username: process.env.MONGO_USER,
  password: process.env.MONGO_PASS,
};
const uri =
  "mongodb://admin:admin123@210.246.215.31:27018/TGR18?authSource=admin";

const connect = async () => {
  try {
    await mongoose.connect(
      // `mongodb://${config.username}:${config.password}@${config.host}:${config.port}/TGR18`
      // `mongodb://root:Admin01@210.246.215.31:27018/TGR18`
      uri
    );
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
