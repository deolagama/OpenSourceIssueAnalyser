/**
 * difficultyService.js
 * --------------------
 * Classifies GitHub issue difficulty as Easy / Medium / Hard using a
 * local Python ML microservice (facebook/bart-large-mnli zero-shot model).
 *
 * If the ML service is unreachable the function falls back to a lightweight
 * heuristic so the app always returns a result.
 */

import axios from "axios";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:5001";

// ─── Heuristic fallback (no keywords, pure signal-based) ─────────────────────
const heuristicDifficulty = (issue) => {
  let score = 0;

  // High comment count → more debate → harder
  if (issue.comments > 10) score += 3;
  else if (issue.comments > 5) score += 1;

  // Long body → detailed / complex issue
  if (issue.body && issue.body.length > 1000) score += 2;
  else if (issue.body && issue.body.length > 400) score += 1;

  // Many labels → more triage → harder
  if (issue.labels && issue.labels.length > 3) score += 1;

  // "good first issue" label → explicitly easy
  const labelNames = (issue.labels || []).map((l) => l.name?.toLowerCase() ?? "");
  if (labelNames.some((n) => n.includes("good first issue") || n.includes("beginner"))) {
    score -= 3;
  }
  if (labelNames.some((n) => n.includes("bug") || n.includes("critical") || n.includes("security"))) {
    score += 2;
  }

  if (score <= 0) return "Easy";
  if (score >= 4) return "Hard";
  return "Medium";
};

// ─── ML-powered classification ────────────────────────────────────────────────
const mlDifficulty = async (issue) => {
  const response = await axios.post(
    `${ML_SERVICE_URL}/classify`,
    {
      title: issue.title || "",
      body:  issue.body  || "",
    },
    { timeout: 15000 }   // 15 s — model may be cold-starting
  );

  // response.data = { difficulty: "Easy"|"Medium"|"Hard", scores: {...} }
  return response.data;
};

// ─── Public export ────────────────────────────────────────────────────────────
/**
 * Labels an issue with a difficulty level.
 * Attempts ML classification first; falls back to heuristic on error.
 *
 * @param {object} issue  - Raw GitHub issue object
 * @returns {object}      - Issue enriched with { difficulty, difficultySource, mlScores? }
 */
export const labelDifficulty = async (issue) => {
  try {
    const { difficulty, scores } = await mlDifficulty(issue);
    console.log(`🤖 ML classified "${issue.title?.slice(0, 50)}" → ${difficulty}`);
    return {
      ...issue,
      difficulty,
      difficultySource: "ml",
      mlScores: scores,          // e.g. { Easy: 0.72, Medium: 0.18, Hard: 0.10 }
    };
  } catch (err) {
    // ML service down or timed out — use heuristic silently
    console.warn(`⚠️  ML service unavailable (${err.message}), using heuristic fallback`);
    const difficulty = heuristicDifficulty(issue);
    return {
      ...issue,
      difficulty,
      difficultySource: "heuristic",
    };
  }
};
