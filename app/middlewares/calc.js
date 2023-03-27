const db = require("../models");
const Points = db.points;
const GlobInfs = db.globinf;
const Machines = db.machine;

const aliveSinceMin = (since) => {
    const diff = Math.abs(Date.now() - since);
    return ((diff/1000)/60);
}

const poidsMalware = (aliveSince) => {
    if (aliveSince < 24*60) {
        return 1;
    } else {
        return 2;
    }
}

const modeMalware = (mode) => {
    switch (mode) {
        case 0:
            return 0;
        case 1:
            return 0.5;
        case 2:
            return 1;
        default:
            return 0;
    }
}

const calc_points = async () => {

    const machines = await Machines.find({});

    const globinfs = await GlobInfs.find();

    // const points = await Points.findOne({}, {}, { sort: { "created_at": -1 } });

    let total = 0;
    console.log(globinfs);
    const Tmax = globinfs[0].total_time;
    machines?.forEach(async (machine) => {
        // if (machine.alive) {
            const alive = machine.alive ? 1 : 0;
            let Tm = aliveSinceMin(machine.since);
            const i = poidsMalware(Tm);
            const m = modeMalware(machine.mode);
            const invest = machine.findinvest ? 0.5 : 1;
            const rdp = machine.findrdp ? 0.8 : 1;
            const revsh = machine.revshell.nb * 4;
            const cmds = machine.cmds * 2;
            const ioc = machine.findioc ? 2 : 1;
            
            Tm = Tm > Tmax ? Tmax : Tm;
    
            let score = ((alive * ((Tm * (i + m) * invest * rdp) + revsh  + cmds))/ ioc);
            console.log(score);
            score = score > Tmax ? Tmax : score;
            total += Number(score.toFixed(5));
            const point = await Points.findOne({machine: machine.computer_name}, {}, { sort: { "date": -1 } });
            // console.log(point);
            if (!point) {
                new Points({pointsMachine: score, machine: machine.computer_name}).save((err) => {
                    if (err) console.log(err);
                })
            } else {
                new Points({pointsMachine: score, machine: machine.computer_name}).save((err) => {
                    if (err)
                        console.log(err)
                    })
            }
        // }
    })
    const newTot = await Points.findOne({machine: "allTogether"}, {}, { sort: { "date": -1 } })
    if (!newTot) {
        new Points({pointsTot: total, machine: "allTogether"}).save((err) => {
            if (err) {
                console.log("error saving new points: here is the problem:");
                console.log(err);
            }
            console.log("pas de point trouvés")
        })
    } else {
        const newPointsTot = parseFloat(total);
        console.log(newPointsTot, newTot.pointsTot + total, total, newTot.pointsTot);
        new Points({pointsTot: newPointsTot, machine: "allTogether"}).save((err) => {
            if (err) {
                console.log("error while adding points to allTogether, here is the problem:");
                console.log(err);
            }
            console.log("points trouvés")
        })
    }
    return true;
}


module.exports = {calc_points}









/*




f1() = 0.142 --> Tm= 0.10
f2() = 0.142 + f2()

*/