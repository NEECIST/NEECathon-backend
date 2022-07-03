import express from "express";
export const profileRoutes = express.Router();
import { supabase } from "../settings.js";

import * as security from "../security/token/token.js";
import * as functions from "../functions/functions.js";

profileRoutes.route("/changeImage").post(async function (req, res) {
  try {
    var Person = await functions.getPerson(security.decode_uuid(req.body.token));
    var teamID = Person.IDTEAM;
    var imageURL = req.body.imageURL;

    const { data, error } = await supabase.from("Teams").update({ IMAGE: imageURL }).eq("IDTEAM", teamID);

    res.json("Sucess");
  } catch (e) {
    res.status(400);
    res.send({ status: "Failure", message: e });
  }
});
