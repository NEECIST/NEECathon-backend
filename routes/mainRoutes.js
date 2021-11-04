import express from "express";
export const mainRoutes = express.Router();

import * as endpoints from "../endpoints/gameEndpoints.js";

mainRoutes.route("/addCoins").post(function (req, res) {
  console.log(req.body);

  endpoints.increasePot(req.body.teamId, parseInt(req.body.value));

  res.json("Sucess");
});
