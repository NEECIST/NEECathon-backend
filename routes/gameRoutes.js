import express from "express";
export const mainRoutes = express.Router();

import * as endpoints from "../endpoints/gameEndpoints.js";
import * as security from "../security/token/token.js";
import * as functions from "../functions/functions.js";

mainRoutes.route("/rollTimer").get(function (req, res) {
  res.json(endpoints.rollTimer());
});

mainRoutes.route("/addCoins").post(function (req, res) {
  var teamId = functions.getPerson(security.decode_uuid(req.token));
  if(teamId!==null){
    endpoints.increasePot(teamId, parseInt(req.body.value));
    packet = JSON.stringify({status: "Sucess"});
    res.json(packet);
  }else{
    packet = JSON.stringify({status: "Failure"});
    res.json(packet);
  }
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
