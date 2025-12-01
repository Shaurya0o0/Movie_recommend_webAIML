import express from "express";
import cors from "cors";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import os from "os";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("<h1>Backend is running successfully</h1>");
});

// Recommend route with try/catch
app.post("/recommend", (req, res) => {
  try {
    const movie = req.body.movie;

    if (!movie) {
      return res.status(400).json({ error: "Movie name is required" });
    }

    // Python script path
    const scriptPath = path.resolve(__dirname, "./Model/artifacts/recommender.py");

    // Determine Python
    let pythonPath;
    if (os.platform() === "win32") {
      pythonPath = path.resolve(__dirname, "../venv/Scripts/python.exe");
    } else {
      pythonPath = "python3"; // Linux (Render)
    }

    // Spawn Python
    const py = spawn(pythonPath, [scriptPath, movie]);

    let output = "";
    let errorOutput = "";

    py.stdout.on("data", (data) => {
      output += data.toString();
    });

    py.stderr.on("data", (err) => {
      errorOutput += err.toString();
    });

    // Timeout safety (10s)
    const timeout = setTimeout(() => {
      py.kill();
      return res.status(500).json({ error: "Python script timed out" });
    }, 10000);

    py.on("close", (code) => {
      clearTimeout(timeout);

      if (errorOutput) {
        console.error("Python error:", errorOutput);
      }

      const clean = output.trim();

      if (!clean) {
        return res.json({
          movie,
          recommendations: ["No recommendations found"]
        });
      }

      const lines = clean
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const movieName = lines[0] || movie;
      const recommendations = lines.slice(1);

      res.json({
        movie: movieName,
        recommendations: recommendations.length ? recommendations : ["No recommendations"]
      });
    });
  } catch (err) {
    console.error("Unexpected server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
