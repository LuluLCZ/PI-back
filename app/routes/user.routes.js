const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // app.get(
  //   "/api/test/mod",
  //   [authJwt.verifyToken, authJwt.isModerator],
  //   controller.moderatorBoard
  // );

  app.get(
    "/getGlobInf",
    controller.getGlobInf
  );

  app.get(
    "/getMachines",
    controller.getMachines
  );

  app.get("/getMachine/:computer_name", controller.getMachine);

  app.get("/api/getPoints", controller.getPoints);

};
