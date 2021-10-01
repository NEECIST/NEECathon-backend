import express from "express";
import cors from "cors";
const app = express();
import dotenv from "dotenv";
import { mainRoutes} from "./routes/mainRoutes.js";

dotenv.config({ path: "./config.env" });
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(mainRoutes);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
