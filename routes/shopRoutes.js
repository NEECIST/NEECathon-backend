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

    if (uuid === null) {
      throw "Wrongly Formated Token.";
      // res.statusCode(406);
      // res.send({ status: "Failure", message: "Wrongly Formated Token." });
      // /*Return invalid token message*/
      // return;
    }
    var user = await functions.getPerson(uuid);

    // if (!user) {
    //   res.statusCode(404);
    //   res.send({ status: "Failure", message: "No user with that uuid." });
    //   /*Return invalid token message*/
    //   return;
    // }
    console.log(user);

    await shopFunctions.buyCart(user.IDTEAM, itemList);

    res.statusCode(200);
    res.send({ status: "Success", message: "Buy concluded successfuly." });
  } catch (e) {
    res.statusCode(404);
    res.send({ status: "Failure", message: e });
  }
});

shopRoutes.route("/updateStock").post(async function (req, res) {
  try {
    var body = req.body;

    var componentId = body.componentId;
    var ammount = body.ammount;
    var token = body.token;

    var uuid = security.decode_uuid(token);

    if (uuid === null) {
      //error
    }

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
