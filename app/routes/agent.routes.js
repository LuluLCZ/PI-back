const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/agent.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/status", controller.statusAgent);
  app.post("/api/alive", controller.alive);
  app.post("/api/announce", controller.announce);
  app.post("/api/revshell", controller.revshell);
  app.post("/api/getRevshell", controller.getRevshell);
  app.post("/api/update", controller.updateAgent);
  app.post("/api/discoverHost", controller.discoveredHosts);

//   app.get("infos") // to do return informations to frontend 
};
