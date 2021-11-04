import express from "express";
export const shopRoutes = express.Router();

import * as endpoints from "../endpoints/shopEndpoints.js";

shopRoutes.route("/products").get(function (req, res) {
  endpoints.productsList().then(function (prodList) {
    const converted = prodList.map(function (prodList) {
      return { id: prodList.IDCOMPONENT, title: prodList.NAME, image: prodList.IMAGE, price: prodList.PRICE, stock: prodList.STOCK, description: prodList.REFSHEET, idHouse: prodList.IDHOUSE };
    });
    converted.sort(compareIds);
    console.log(converted, "Routes");
    res.json(converted);
  });
});

shopRoutes.route("/buy").post(function (req, res) {
  console.log(req.body);
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
