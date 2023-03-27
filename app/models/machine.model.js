const mongoose = require("mongoose");

const Machine = mongoose.model(
  "Machine",
  new mongoose.Schema({
      ip: String,
      network: String,
      computer_name: String,
      os: String,
      dns_domain: String,
      log_on_server: Boolean,
      username: String,
      alive: Boolean,
      since: {
        type: Date,
        default: Date.now
      },
      findioc: {
        type: Boolean,
        default: false
      },
      findinvest: {
        type: Boolean,
        default: false
      },
      findrdp: {
        type: Boolean,
        default: false
      },
      revshell: Object,
      mode: Number,
      cmds: Number
  }, {collection: "Machines"})
);

module.exports = Machine;
