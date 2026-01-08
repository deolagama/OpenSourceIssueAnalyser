export const markStaleIssues = (issues) => {
  const now = new Date();

  return issues.map(issue => {
    const updated = new Date(issue.updated_at);
    const days = (now - updated) / (1000 * 60 * 60 * 24);

    return { ...issue, stale: days > 90 };
  });
};
