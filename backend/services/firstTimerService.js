export const findFirstTimerIssues = (issues) => {
  return issues.filter(issue =>
    issue.difficulty === "Easy" &&
    issue.comments < 3 &&
    !issue.assignee
  );
};
