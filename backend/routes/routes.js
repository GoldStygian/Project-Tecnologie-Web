import express from "express";
import path from "path";
import { fileURLToPath } from "url";
// import { ResetController } from "../controllers/ResetController.js";

export const rootRouter = new express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

rootRouter.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "../templates", "index.html"));
});