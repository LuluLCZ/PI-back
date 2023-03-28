const mongoose = require("mongoose");

const Machine = mongoose.model(
  "Machine",
  new mongoose.Schema({
      ip: String,
      network: String,
      computer_name: String,
      os: String,
      dns_domain: String,
      log_on_server: String,
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
      revshell: {
        type: Object,
        default: { need: false, ip: "", port: -1, nb: 0 }
      },
      mode: {
        type: Number,
        default: 0
      },
      cmds: {
        type: Number,
        default: 0
      },
      lastAlive: {
        type: Date,
        default: Date.now
      },
      deadAt: {
        type: Date
      }
  }, {collection: "Machines"})
);

module.exports = Machine;
