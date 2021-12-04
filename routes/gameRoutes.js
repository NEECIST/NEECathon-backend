import express from "express";
export const mainRoutes = express.Router();

import * as endpoints from "../endpoints/gameEndpoints.js";
import * as security from "../security/token/token.js";
import * as functions from "../functions/functions.js";

mainRoutes.route("/rollTimer").get(function (req, res) {
  res.json(endpoints.rollTimer());
});

mainRoutes.route("/addCoins").post(function (req, res) {
  try{
    var Person = functions.getPerson(security.decode_uuid(req.body.token));
    var teamId = Person.teamID;
    if(teamId !== 1) throw "User is not Admin!";
    await endpoints.teamAddCoins(teamId, parseInt(req.body.value));
    res.send({ status: "Success"});
  }catch(e){
    res.status(400);
    res.send({ status: "Failure", message: e });
  }
});

mainRoutes.route("/subtractCoins").post(function (req, res) {
  try{
    var Person = functions.getPerson(security.decode_uuid(req.body.token));
    var teamId = Person.teamID;
    if(teamId !== 1) throw "User is not Admin!";
    await endpoints.teamSubtractCoins(teamId, parseInt(req.body.value));
    res.send({ status: "Success"});
  }catch(e){
    res.status(400);
    res.send({ status: "Failure", message: e });
  }
});

mainRoutes.route("/setCoins").post(function (req, res) {
  try{
    var Person = functions.getPerson(security.decode_uuid(req.body.token));
    var teamId = Person.teamID;
    if(teamId !== 1) throw "User is not Admin!";
    await endpoints.setCoinsTeam(teamId, parseInt(req.body.value));
    res.send({ status: "Success"});
  }catch(e){
    res.status(400);
    res.send({ status: "Failure", message: e });
  }
});

mainRoutes.route("/throwDices").get(function (req, res) {
  try{
    var Person = functions.getPerson(security.decode_uuid(req.body.token));
    var teamId = Person.teamID;
    if(teamId !== 1) throw "User is not Admin!";
    roll = await endpoints.throwDices(teamID);
    res.send({ status: "Success", value: roll});
  }catch(e){
    res.status(400);
    res.send({ status: "Failure", message: e });
  }
})

mainRoutes.route("/transferCoins").get(function (req, res) {
  try{
    var Person = functions.getPerson(security.decode_uuid(req.body.token));
    var teamId = Person.teamID;
    if(teamId !== 1) throw "User is not Admin!";
    var minusTeam = req.body.minusTeam;
    var plusTeam = req.body.plusTeam;
    var value = req.body.value;
    await endpoints.transferCoins(minusTeam, plusTeam, value);
    res.send({ status: "Success"});
  }catch(e){
    res.status(400);
    res.send({ status: "Failure", message: e });
  }
})

mainRoutes.route("/transferCoins")
