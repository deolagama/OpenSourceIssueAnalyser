import axios from "axios";

const headers = {
  "Accept": "application/vnd.github.v3+json"
};

// Add auth token only if it's set (avoids sending "token undefined")
if (process.env.GITHUB_TOKEN && process.env.GITHUB_TOKEN !== "your_github_token_here") {
  headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
}

const githubApi = axios.create({
  baseURL: "https://api.github.com",
  headers
});

export default githubApi;
