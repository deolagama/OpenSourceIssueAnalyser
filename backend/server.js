import https from "https";
import fs from "fs";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import analyzeRoutes from "./routes/analyzeRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Open Source Issue Analyser Backend Running 🚀");
});

// Auth routes (no JWT required)
app.use("/api/auth", authRoutes);

// Protected routes (JWT required)
app.use("/api/analyze", analyzeRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// Create HTTPS server with SSL certificates
const createServer = () => {
  try {
    // Check if SSL certificates exist
    if (
      fs.existsSync(process.env.SSL_CERT_PATH) &&
      fs.existsSync(process.env.SSL_KEY_PATH)
    ) {
      const options = {
        cert: fs.readFileSync(process.env.SSL_CERT_PATH),
        key: fs.readFileSync(process.env.SSL_KEY_PATH)
      };
      return https.createServer(options, app);
    } else {
      console.warn(
        "SSL certificates not found. Running on HTTP. For HTTPS, set SSL_CERT_PATH and SSL_KEY_PATH in .env"
      );
      return app;
    }
  } catch (err) {
    console.error("Error reading SSL certificates:", err.message);
    console.log("Falling back to HTTP");
    return app;
  }
};

const server = createServer();

server.listen(PORT, () => {
  console.log(`Backend running on ${process.env.USE_HTTPS === "true" ? "HTTPS" : "HTTP"} - port ${PORT}`);
});
