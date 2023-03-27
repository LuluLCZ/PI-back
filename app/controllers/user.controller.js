const { sanitize } = require("mongodb-sanitize");
const db = require("../models");

const Role = db.role;
const GlobInf = db.globinf;
const Machine = db.machine;
const Points = db.points;

const allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

const userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

const adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

const moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

const getGlobInf = (req, res) => {
  GlobInf.find()
  .exec((err, response) => {
    if (!err) {
      console.log(response)
    }
    if (err) {
      res.status(500).send({message: err});
      return ;
    }
    console.log(response);
    res.status(200).send(response);
  })
  return ;
}

const getMachines = (req, res) => {
  Machine.find().exec((err, response) => {
    if (err) {
      res.status(500).send({message: err});
      return ;
    }
    console.log(response);
    res.status(200).send(response);
    return ;
  })
}

const getMachine = (req, res) => {
  computer_name = sanitize(req.params.computer_name);
  console.log(computer_name);
  Machine.find({computer_name: computer_name}).exec((err, response) => {
    if (err) {
      res.status(500).send({message: err});
      return ;
    }
    console.log(response);
    res.status(200).send(response);
    return ;
  })
}

const getPoints = (req, res) => {
  Points.find().exec((err, response) => {
    if (err) {
      res.status(500).send({message: err});
      return ;
    }
    res.status(200).send(response);
    return ;
  })
}

module.exports = {getGlobInf,allAccess,
  userBoard,
  adminBoard,
  moderatorBoard,
  getMachines,
  getMachine,
  getPoints
};