const mongoose = require("mongoose");

const Points = mongoose.model(
  "Points",
  new mongoose.Schema({
    pointsMachine: Number,
    pointsTot: Number,
    date: {
        type: Date,
        default: Date.now
    },
    machine: String
  }, {collection: "Points"})
);

module.exports = Points;
