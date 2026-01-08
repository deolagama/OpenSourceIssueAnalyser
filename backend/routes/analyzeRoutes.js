import express from "express";
import { analyzeRepo } from "../controllers/analyzeController.js";

const router = express.Router();

router.post("/", analyzeRepo);

export default router;
