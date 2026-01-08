import { fetchIssues } from "../services/githubService.js";
import { labelDifficulty } from "../services/difficultyService.js";
import { markStaleIssues } from "../services/staleService.js";
import { findDuplicates } from "../services/duplicateService.js";
import { findFirstTimerIssues } from "../services/firstTimerService.js";

export const analyzeRepo = async (req, res) => {
  try {
    const { repo } = req.body;
    const [owner, name] = repo.split("/");

    let issues = await fetchIssues(owner, name);

    issues = issues.map(issue => labelDifficulty(issue));
    issues = markStaleIssues(issues);

    const duplicates = findDuplicates(issues);
    const firstTimer = findFirstTimerIssues(issues);

    res.json({
      issues,
      duplicates,
      firstTimer
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
