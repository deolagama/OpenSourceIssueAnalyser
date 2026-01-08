import keywords from "../data/keywords.json" assert { type: "json" };

export const labelDifficulty = (issue) => {
  let score = 0;

  if (issue.comments > 5) score += 2;
  if (issue.body && issue.body.length > 500) score += 2;

  keywords.easy.forEach(k => {
    if (issue.body?.toLowerCase().includes(k)) score -= 2;
  });

  keywords.hard.forEach(k => {
    if (issue.body?.toLowerCase().includes(k)) score += 2;
  });

  let difficulty = "Medium";
  if (score <= 0) difficulty = "Easy";
  if (score >= 4) difficulty = "Hard";

  return { ...issue, difficulty };
};
