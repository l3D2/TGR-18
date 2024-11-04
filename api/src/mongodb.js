const mongoose = require("mongoose");

const config = {
  host: process.env.MONGO_HOST,
  port: process.env.MONGO_PORT,
  username: process.env.MONGO_USER,
  password: process.env.MONGO_PASS,
};

const connect = async () => {
  try {
    await mongoose.connect(
      `mongodb://${config.username}:${config.password}@${config.host}:${config.port}/TGR18`,
      { useNewUrlParser: true, useUnifiedTopology: true }
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
