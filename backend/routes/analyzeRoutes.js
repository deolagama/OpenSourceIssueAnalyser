import express from "express";
import { analyzeRepo } from "../controllers/analyseControllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect the analyze route with JWT verification
router.post("/", verifyToken, analyzeRepo);

export default router;
