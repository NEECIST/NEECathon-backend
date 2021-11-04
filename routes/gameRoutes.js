import express from "express";
export const mainRoutes = express.Router();

import * as endpoints from "../endpoints/gameEndpoints.js";

mainRoutes.route("/addCoins").post(function (req, res) {
  console.log(req.body);

  endpoints.increasePot(req.body.teamId, parseInt(req.body.value));

  res.json("Sucess");
});

mainRoutes.route("/throwDices").get(function (req, res) {
  var teamID = req.body.teamID;

  //Add check if it is admin//
    endpoints.throwDices(teamID).then(function (rolls) {
    console.log(rolls, "Routes");
    res.json(rolls);
  }).catch(function(e) {
    console.log(e);
  });
})

mainRoutes.route("/transferCoins").get(function (req, res) {
  var minusTeam = req.body.minusTeam;
  var plusTeam = req.body.plusTeam;
  var value = req.body.value;

  //Add check if it is admin or create accept system with admin whitelist//

  endpoints.transferCoins(minusTeam, plusTeam, value).then(function (rolls) {
    console.log(rolls, "Routes");
    res.json(rolls);
  }).catch(function(e) {
    console.log(e);
  });
})



mainRoutes.route("/transferCoins")
