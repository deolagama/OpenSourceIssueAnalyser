import githubApi from "../config/github.js";

export const fetchIssues = async (owner, repo) => {
  const res = await githubApi.get(`/repos/${owner}/${repo}/issues`);
  return res.data.filter(issue => !issue.pull_request);
};
