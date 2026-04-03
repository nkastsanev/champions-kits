import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import dotenv from 'dotenv';
import router from "./routes/routes.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", router);

connectDB()
  .then(() => {
    app.listen(5000, () => console.log("Server running on http://localhost:5000"));
  })
  .catch((err) => {
    console.error("Cannot start server due to DB connection error:", err);
  });