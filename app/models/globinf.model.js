const mongoose = require("mongoose");

const GlobInf = mongoose.model(
  "GlobInf",
  new mongoose.Schema({
    scanned_networks: Array,
    infected: Array,
    vulnerable_machines: Array,
    total_machine: Number,
    total_time: {
      type: Number,
      default: 10
    },
    discoveredHosts: Array
  }, {collection: "GlobInf"})
);

module.exports = GlobInf;
