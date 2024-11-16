const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  ts: {
    type: String,
  },
  message: {
    type: String,
  },
});

const schema = mongoose.model("Data", Schema, "mqtt");

module.exports = { schema };
