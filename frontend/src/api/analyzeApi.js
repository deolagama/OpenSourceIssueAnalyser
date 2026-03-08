import axios from "axios";

const API = "https://reimagined-dollop-7vw9p5p94p773x9v9-5000.app.github.dev";

export const analyzeRepo = async (repo) => {
  const res = await axios.post(`${API}/api/analyze`, { repo });
  return res.data;
};