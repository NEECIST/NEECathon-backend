import express from "express";
export const shopRoutes = express.Router();

import * as endpoints from "../endpoints/shopEndpoints.js";
import * as security from "../security/token/token.js";
import * as functions from "../functions/functions.js";
import * as shopFunctions from "../endpoints/shopEndpoints.js";

shopRoutes.route("/products").get(function (req, res) {
  endpoints
    .productsList()
    .then(function (prodList) {
      //Checks if the function runned correctly to obtain the product list, else respond with {result: 'Fail', data: ''}
      if (prodList.result === "Sucess") {
        const converted = prodList.data.map(function (item) {
          return { id: item.IDCOMPONENT, title: item.NAME, image: item.IMAGE, price: item.PRICE, stock: item.STOCK, description: item.REFSHEET, idHouse: item.IDHOUSE };
        });
        converted.sort(compareIds);
        prodList.data = converted;

        res.json(prodList);
      } else {
        res.json(prodList);
      }
    })
    .catch(function (e) {
      console.log(e);
    });
});

shopRoutes.route("/buy").post(async function (req, res) {
  var body = req.body;

  var itemList = body.itemList;
  var token = body.token;

  var uuid = security.decode_uuid(token);

  if (uuid === null) {
    res.send({ status: "Failure", message: "No user with that uuid" });
    /*Return invalid token message*/
    return;
  }
  var user = await functions.getPerson(uuid);
  console.log(user);

  shopFunctions.buyCart(user.IDTEAM, itemList);
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
