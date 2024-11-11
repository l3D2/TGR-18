const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  ts: {
    type: Number,
    default: () => Math.floor(Date.now() / 1000), // Unix timestamp in seconds
  },
  data: {
    exp: {
      type: Number,
      default: 0,
    },
    mch_status: {
      type: Number,
      default: 0,
      min: 0,
      max: 2,
    },
    pred: {
      type: String,
    },
  },
  files: {
    original: {
      type: String,
    },
    filtered: {
      type: String,
    },
  },
});
const Schema2 = new mongoose.Schema({
  ts: {
    type: Number,
    default: () => Math.floor(Date.now() / 1000), // Unix timestamp in seconds
  },
  data: {
    type: String,
  },
});

const schema = mongoose.model("Data", Schema, "data");
// const schema2 = mongoose.model("Schema2", Schema2);

module.exports = { schema };
