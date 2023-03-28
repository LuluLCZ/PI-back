const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.globinf = require("./globinf.model");
db.machine = require("./machine.model");
db.points = require("./points.model");
db.nums = require("./nb.model");

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;