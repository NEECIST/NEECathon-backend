import express from "express";
export const mainRoutes = express.Router();

import * as endpoints from "../endpoints/gameEndpoints.js";
import * as security from "../security/token/token.js";
import * as functions from "../functions/functions.js";

mainRoutes.route("/rollTimer").get(function (req, res) {
  res.json(endpoints.rollTimer());
});

mainRoutes.route("/setLastTime").get(async function (req, res) {
  try {
    var Person = await functions.getPerson(security.decode_uuid(req.body.token));
    var teamId = Person.IDTEAM;
    if (teamId !== functions.NEEC_TEAM_ID) throw "User is not Admin!";
    res.json(await endpoints.lastRoundTime());
  } catch (e) {
    res.status(400);
    res.send({ status: "Failure", message: e });
  }
  res.json(endpoints.lastRoundTime());
});

mainRoutes.route("/addCoins").post(async function (req, res) {
  try {
    var Person = await functions.getPerson(security.decode_uuid(req.body.token));
    var teamId = Person.IDTEAM;
    if (teamId !== functions.NEEC_TEAM_ID) throw "User is not Admin!";
    await endpoints.teamAddCoins(teamId, parseInt(req.body.value));
    res.send({ status: "Success" });
  } catch (e) {
    res.status(400);
    res.send({ status: "Failure", message: e });
  }
});

mainRoutes.route("/subtractCoins").post(async function (req, res) {
  try {
    var Person = await functions.getPerson(security.decode_uuid(req.body.token));
    var teamId = Person.IDTEAM;
    if (teamId !== functions.NEEC_TEAM_ID) throw "User is not Admin!";
    await endpoints.teamSubtractCoins(teamId, parseInt(req.body.value));
    res.send({ status: "Success" });
  } catch (e) {
    res.status(400);
    res.send({ status: "Failure", message: e });
  }
});

mainRoutes.route("/setCoins").post(async function (req, res) {
  try {
    var Person = await functions.getPerson(security.decode_uuid(req.body.token));
    var teamId = Person.IDTEAM;
    if (teamId !== functions.NEEC_TEAM_ID) throw "User is not Admin!";
    await endpoints.setCoinsTeam(teamId, parseInt(req.body.value));
    res.send({ status: "Success" });
  } catch (e) {
    res.status(400);
    res.send({ status: "Failure", message: e });
  }
});

mainRoutes.route("/throwDices").post(async function (req, res) {
  try {
    var Person = await functions.getPerson(security.decode_uuid(req.body.token));
    var admin = Person.IDTEAM;
    if (admin !== functions.NEEC_TEAM_ID) throw "User is not Admin!";
    let roll_result = await endpoints.throwDices(req.body.team);
    let play_result = await endpoints.playAnalize(roll_result[1], parseInt(req.body.team));
    let final_description = "Rodaram um <b>" + roll_result[0] + "</b>. Isso deixa-vos na casa de <b>" + play_result[1];
    endpoints.lastRoundTime();
    res.send({ status: "Success", teamID: req.body.team, interactable: play_result[0], description: final_description });
  } catch (e) {
    res.status(400);
    res.send({ status: "Failure", message: e });
  }
});

mainRoutes.route("/transferCoins").post(async function (req, res) {
  try {
    console.log(req.body);
    var Person = await functions.getPerson(security.decode_uuid(req.body.token));
    var teamId = Person.IDTEAM;
    if (teamId !== functions.NEEC_TEAM_ID) throw "User is not Admin!";
    var minusTeam = parseInt(req.body.minusTeam);
    var plusTeam = parseInt(req.body.plusTeam);
    var value = parseInt(req.body.value);
    await endpoints.transferCoins(minusTeam, plusTeam, value);
    res.send({ status: "Success" });
  } catch (e) {
    console.log(e);
    res.status(400);
    res.send({ status: "Failure", message: e });
  }
});

mainRoutes.route("/buyPatent").post(async function (req, res) {
  try {
    var Person = await functions.getPerson(security.decode_uuid(req.body.token));
    var teamID = req.body.team;
    if (Person.IDTEAM !== functions.NEEC_TEAM_ID) throw "User is not Admin!";
    await endpoints.buyPatent(teamID);
    res.status(200);
    res.send({ status: "Success" });
  } catch (e) {
    console.log(e);
    res.status(400);
    res.send({ status: "Failure", message: e });
  }
});

mainRoutes.route("/increasePot").post(async function (req, res) {
  try {
    var Person = await functions.getPerson(security.decode_uuid(req.body.token));
    var teamId = Person.IDTEAM;
    var cash = req.body.cash;
    if (teamId !== functions.NEEC_TEAM_ID) throw "User is not Admin!";
    await endpoints.increasePot(teamId, cash);
    res.status(200);
    res.send({ status: "Success" });
  } catch (e) {
    res.status(404);
    res.send({ status: "Failure", message: e });
  }
});

mainRoutes.route("/receivePot").post(async function (req, res) {
  try {
    var Person = await functions.getPerson(security.decode_uuid(req.body.token));
    var teamId = Person.IDTEAM;
    if (teamId !== functions.NEEC_TEAM_ID) throw "User is not Admin!";
    await endpoints.receivePot(teamId);
    res.status(200);
    res.send({ status: "Success" });
  } catch (e) {
    res.status(404);
    res.send({ status: "Failure", message: e });
  }
});

mainRoutes.route("/removePlayerFromTeam").post(async function (req, res) {
  try {
    var Person = await functions.getPerson(security.decode_uuid(req.body.token));
    var teamId = Person.IDTEAM;
    var personId = Person.IDPERSON;
    if (teamId !== functions.NEEC_TEAM_ID) throw "User is not Admin!";
    await endpoints.removePlayerFromTeam(personId);
    res.status(200);
    res.send({ status: "Success" });
  } catch (e) {
    res.status(404);
    res.send({ status: "Failure", message: e });
  }
});

mainRoutes.route("/setPlayerTeam").post(async function (req, res) {
  try {
    var Person = await functions.getPerson(security.decode_uuid(req.body.token));
    var teamId = Person.IDTEAM;
    var personId = Person.IDPERSON;
    if (teamId !== functions.NEEC_TEAM_ID) throw "User is not Admin!";
    await endpoints.setPlayerTeam(personId, teamId);
    res.status(200);
    res.send({ status: "Success" });
  } catch (e) {
    res.status(404);
    res.send({ status: "Failure", message: e });
  }
});

mainRoutes.route("/transferHouse").post(async function (req, res) {
  try {
    var Person = await functions.getPerson(security.decode_uuid(req.body.token));
    var teamId = Person.IDTEAM;
    var houseID = req.body.houseID;
    var oldTeamID = req.body.newTeamID;
    var newTeamID = req.body.newTeamID;
    if (teamId !== functions.NEEC_TEAM_ID) throw "User is not Admin!";
    await endpoints.transferHouse(oldTeamID, houseID, newTeamID);
    res.status(200);
    res.send({ status: "Success" });
  } catch (e) {
    res.status(404);
    res.send({ status: "Failure", message: e });
  }
});

mainRoutes.route("/cardLC").post(async function (req, res) {
  try {
    var Person = await functions.getPerson(security.decode_uuid(req.body.token));
    var teamId = Person.IDTEAM;
    if (teamId !== functions.NEEC_TEAM_ID) throw "User is not Admin!";
    description = await endpoints.cardLC(teamId);
    res.status(200);
    res.send({ status: "Success", message: description });
  } catch (e) {
    res.status(404);
    res.send({ status: "Failure", message: e });
  }
});
