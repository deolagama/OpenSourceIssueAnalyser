import githubApi from "../config/github.js";

export const fetchIssues = async (owner, repo, maxPages = 2) => {
  const allIssues = [];

  for (let page = 1; page <= maxPages; page++) {
    const res = await githubApi.get(`/repos/${owner}/${repo}/issues`, {
      params: {
        state: "open",
        per_page: 100,
        page,
        sort: "updated",
        direction: "desc"
      }
    });

    const issues = res.data.filter(issue => !issue.pull_request);
    allIssues.push(...issues);

    // Stop early if we got fewer than per_page (last page)
    if (res.data.length < 100) break;
  }

  return allIssues;
};
