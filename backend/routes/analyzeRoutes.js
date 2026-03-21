import express from "express";
import { analyzeRepo } from "../controllers/analyseControllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route — no JWT required (for easy local dev & unauthenticated use)
router.post("/public", analyzeRepo);

// Protected route — JWT required
router.post("/", verifyToken, analyzeRepo);

export default router;
