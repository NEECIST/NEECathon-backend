import express from "express";
import cors from "cors";
const app = express();
import dotenv from "dotenv";
import { mainRoutes } from "./routes/gameRoutes.js";
import { shopRoutes } from "./routes/shopRoutes.js";
dotenv.config({ path: "./config.env" });
const port = process.env.PORT || 5000;
import * as request from "./endpoints/shopEndpoints.js";

app.use(cors());
app.use(express.json());
app.use(mainRoutes);
app.use(shopRoutes);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

let cart = [{id: 29, quantity: 3}, {id: 13, quantity: 1}]

request.buyCart(1, cart)
