import express from "express";
export const userRoutes = express.Router();

import * as endpoints from "../endpoints/userEndpoints.js";

userRoutes.route("/addUser").post(function (req, res) {
  console.log(req.body,"Body");

  endpoints.verifyUser("Andre")

  endpoints.addUser(req.body.teamId);

  res.json("Sucess");
});