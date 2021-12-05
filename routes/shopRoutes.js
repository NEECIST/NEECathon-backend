import express from "express";
export const shopRoutes = express.Router();

import * as security from "../security/token/token.js";
import * as functions from "../functions/functions.js";
import * as shopFunctions from "../endpoints/shopEndpoints.js";

shopRoutes.route("/buy").post(async function (req, res) {
  try {
    var body = req.body;
    var itemList = body.itemList;
    var token = body.token;

    var uuid = security.decode_uuid(token);

    if (uuid === null) throw "Wrongly Formated Token. (/buy route)";

    var user = await functions.getPerson(uuid);

    await shopFunctions.buyCart(user.IDTEAM, itemList);
    res.status(200);
    res.send({ status: "Success", message: "Buy concluded successfuly." });
  } catch (error) {
    res.status(400);
    res.send({ status: "Failure", message: error });
  }
});

shopRoutes.route("/updateStock").post(async function (req, res) {
  try {
    var body = req.body;

    var componentId = body.componentId;
    var ammount = body.ammount;
    var token = body.token;

    var uuid = security.decode_uuid(token);

    if (uuid === null) throw "Wrongly Formated Token. (/buy route)"

    var user = await functions.getPerson(uuid);

    if(user.IDTEAM === functions.NEEC_TEAM_ID) {
      await shopFunctions.updateStock(componentId, ammount);
    } else {
      // error
    }

    res.statusCode(200);
    res.send({ status: "Success", message: "Stock update concluded successfuly." });

  } catch (e) {
    res.statusCode(404);
    res.send({ status: "Failure", message: e });
  }
});

function compareIds(a, b) {
  if (a.id < b.id) {
    return -1;
  }
  if (a.id > b.id) {
    return 1;
  }
  return 0;
}
