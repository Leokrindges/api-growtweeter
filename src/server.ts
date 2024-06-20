import { log } from "console";
import cors from "cors";
import "dotenv/config";
import express from "express";

const app = express();
app.use(express.json());
app.use(cors());

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
