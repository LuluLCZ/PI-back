const mongoose = require("mongoose");

const Nums = mongoose.model(
  "Nums",
  new mongoose.Schema({
    alive: Number,
    atTime: {
        type: Date,
        default: Date.now
    }
  }, {collection: "Nums"})
);

module.exports = Nums;
