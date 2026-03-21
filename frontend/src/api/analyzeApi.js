import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { "Content-Type": "application/json" }
});

export const analyzeRepo = async (repo) => {
  // Use the public route (no JWT required)
  const res = await api.post("/api/analyze/public", { repo });
  return res.data;
};

export const loginUser = async (username, password) => {
  const res = await api.post("/api/auth/login", { username, password });
  return res.data;
};

export const registerUser = async (username, password) => {
  const res = await api.post("/api/auth/register", { username, password });
  return res.data;
};

export const healthCheck = async () => {
  const res = await api.get("/api/health");
  return res.data;
};