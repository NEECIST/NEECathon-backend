import express from "express";
import cors from "cors";
const app = express();
import dotenv from "dotenv";
import { mainRoutes } from "./routes/gameRoutes.js";
import { shopRoutes } from "./routes/shopRoutes.js";
import { profileRoutes } from "./routes/profileRoutes.js";
dotenv.config({ path: "./config.env" });
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(mainRoutes);
app.use(shopRoutes);
app.use(profileRoutes);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
