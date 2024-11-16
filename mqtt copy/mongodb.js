const mongoose = require("mongoose");

const connect = async () => {
  try {
    await mongoose.connect(
      // `mongodb://Team2:Admin02@localhost:27018/TGR18?authSource=admin`,
      `mongodb://Team2:Admin02@host.docker.internal:27018/TGR18?authSource=admin`,
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
