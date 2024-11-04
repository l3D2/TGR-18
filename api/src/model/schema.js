const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  ts: {
    type: Number,
    default: () => Math.floor(Date.now() / 1000), // Unix timestamp in seconds
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

const schema = mongoose.model("Schema", Schema);
const schema2 = mongoose.model("Schema2", Schema2);

module.exports = { schema, schema2 };
