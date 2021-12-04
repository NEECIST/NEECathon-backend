import express from "express";
export const mainRoutes = express.Router();

import * as endpoints from "../endpoints/gameEndpoints.js";
import * as security from "../security/token/token.js";
import * as functions from "../functions/functions.js";

mainRoutes.route("/rollTimer").get(function (req, res) {
  res.json(endpoints.rollTimer());
});

mainRoutes.route("/addCoins").post(function (req, res) {
  var teamId = functions.getPerson(security.decode_uuid(req.body.token));
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

shopRoutes.route("/buyPatent").post(async function (req, res) {
  try {
    var body = req.body;

    var teamID = body.teamID;
    var houseID = body.houseID;
    var token = body.token;

    var uuid = security.decode_uuid(token);

    if (uuid === null) {
      //TODO error
    }

    var user = await functions.getPerson(uuid);

    if(user.IDTEAM === functions.NEEC_TEAM_ID) {
      await endpoints.buyPatent(teamID, houseID);
    } else {
      // TODO error
    }

    res.statusCode(200);
    res.send({ status: "Success", message: "buyPatent concluded successfuly." });

  } catch (e) {
    res.statusCode(404);
    res.send({ status: "Failure", message: e });
  }
});

shopRoutes.route("/increasePot").post(async function (req, res) {
  try {
    var body = req.body;

    var teamID = body.teamID;
    var cash = body.cash;
    var token = body.token;

    var uuid = security.decode_uuid(token);

    if (uuid === null) {
      //TODO error
    }

    var user = await functions.getPerson(uuid);

    if(user.IDTEAM === functions.NEEC_TEAM_ID) {
      await endpoints.increasePot(teamID, cash);
    } else {
      // TODO error
    }

    res.statusCode(200);
    res.send({ status: "Success", message: "increasePot concluded successfuly." });

  } catch (e) {
    res.statusCode(404);
    res.send({ status: "Failure", message: e });
  }
});

shopRoutes.route("/receivePot").post(async function (req, res) {
  try {
    var body = req.body;

    var teamID = body.teamID;
    var token = body.token;

    var uuid = security.decode_uuid(token);

    if (uuid === null) {
      //TODO error
    }

    var user = await functions.getPerson(uuid);

    if(user.IDTEAM === functions.NEEC_TEAM_ID) {
      await endpoints.receivePot(teamID);
    } else {
      // TODO error
    }

    res.statusCode(200);
    res.send({ status: "Success", message: "receivePot concluded successfuly." });

  } catch (e) {
    res.statusCode(404);
    res.send({ status: "Failure", message: e });
  }
});

shopRoutes.route("/removePlayerFromTeam").post(async function (req, res) {
  try {
    var body = req.body;

    var personID = body.personID;
    var token = body.token;

    var uuid = security.decode_uuid(token);

    if (uuid === null) {
      //TODO error
    }

    var user = await functions.getPerson(uuid);

    if(user.IDTEAM === functions.NEEC_TEAM_ID) {
      await endpoints.removePlayerFromTeam(personID);
    } else {
      // TODO error
    }

    res.statusCode(200);
    res.send({ status: "Success", message: "removePlayerFromTeam concluded successfuly." });

  } catch (e) {
    res.statusCode(404);
    res.send({ status: "Failure", message: e });
  }
});

shopRoutes.route("/setPlayerTeam").post(async function (req, res) {
  try {
    var body = req.body;

    var personID = body.personID;
    var teamID = body.teamID;
    var token = body.token;

    var uuid = security.decode_uuid(token);

    if (uuid === null) {
      //TODO error
    }

    var user = await functions.getPerson(uuid);

    if(user.IDTEAM === functions.NEEC_TEAM_ID) {
      await endpoints.setPlayerTeam(personID, teamID);
    } else {
      // TODO error
    }

    res.statusCode(200);
    res.send({ status: "Success", message: "setPlayerTeam concluded successfuly." });

  } catch (e) {
    res.statusCode(404);
    res.send({ status: "Failure", message: e });
  }
});

shopRoutes.route("/transferHouse").post(async function (req, res) {
  try {
    var body = req.body;

    var houseID = body.houseID;
    var newTeamID = body.newTeamID;
    var token = body.token;

    var uuid = security.decode_uuid(token);

    if (uuid === null) {
      //TODO error
    }

    var user = await functions.getPerson(uuid);

    await endpoints.transferHouse(user.IDTEAM, houseID, newTeamID);

    res.statusCode(200);
    res.send({ status: "Success", message: "transferHouse concluded successfuly." });

  } catch (e) {
    res.statusCode(404);
    res.send({ status: "Failure", message: e });
  }
});

shopRoutes.route("/shuffleCards").post(async function (req, res) {
  try {
    var body = req.body;

    var token = body.token;

    var uuid = security.decode_uuid(token);

    if (uuid === null) {
      //TODO error
    }

    var user = await functions.getPerson(uuid);

    if(user.IDTEAM === functions.NEEC_TEAM_ID) {
      await endpoints.shuffleCards();
    } else {
      //TODO error
    }

    res.statusCode(200);
    res.send({ status: "Success", message: "shuffleCards concluded successfuly." });

  } catch (e) {
    res.statusCode(404);
    res.send({ status: "Failure", message: e });
  }
});

shopRoutes.route("/cardLC").post(async function (req, res) {
  try {
    var body = req.body;

    var token = body.token;
    var teamID = body.teamID;

    var uuid = security.decode_uuid(token);

    if (uuid === null) {
      //TODO error
    }

    var user = await functions.getPerson(uuid);

    if(user.IDTEAM === functions.NEEC_TEAM_ID) {
      await endpoints.cardLC(teamID);
    } else {
      //TODO error
    }

    res.statusCode(200);
    res.send({ status: "Success", message: "cardLC concluded successfuly." });

  } catch (e) {
    res.statusCode(404);
    res.send({ status: "Failure", message: e });
  }
});



mainRoutes.route("/transferCoins")
