import express from "express";
import { connectDB } from "./db.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

connectDB().then(() => {
  app.listen(5000, () => console.log("Server running on port 5000"));
}).catch(err => {
  console.error("Cannot start server due to DB connection error:", err);
});
