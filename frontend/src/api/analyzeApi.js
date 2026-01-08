import axios from "axios";

export const analyzeRepo = async (repo) => {
  const res = await axios.post("http://localhost:5000/api/analyze", { repo });
  return res.data;
};
