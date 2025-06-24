import express from "express";
import path from "path";
import __dirname from "../config/dirname.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

export default router;