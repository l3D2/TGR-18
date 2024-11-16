const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  ts: {
    type: Number,
    default: () => Math.floor(Date.now() / 1000), // Unix timestamp in seconds
  },
  predict: {
    type: String,
  },
  feature: {
    type: Array,
  },
  conf: {
    type: Number,
  },
  datasize: {
    type: Number,
  },
  file: {
    type: String,
  },
});

const SchemaSound = new mongoose.Schema({
  ts: {
    type: Number,
  },
  audiopos: {
    type: Number,
  },
  sound: {
    type: Array,
  },
});

const mechine = new mongoose.Schema({
  ts: {
    type: Number,
    default: () => Math.floor(Date.now() / 1000), // Unix timestamp in seconds
  },
  power: {
    type: Number,
    default: 0,
  },
  L1_GND: {
    type: Number,
    default: 0,
  },
  L2_GND: {
    type: Number,
    default: 0,
  },
  L3_GND: {
    type: Number,
    default: 0,
  },
  pressure: {
    type: Number,
    default: 0,
  },
  force: {
    type: Number,
    default: 0,
  },
  cycle_count: {
    type: Number,
    default: 0,
  },
  PoP: {
    type: Number,
    default: 0,
  },
});

const schema = mongoose.model("Data", Schema, "data");
const machineSchema = mongoose.model("mechine", mechine, "mechine");
const schemaSound = mongoose.model("SchemaSound", SchemaSound, "sound");

module.exports = { schema, machineSchema, schemaSound };
