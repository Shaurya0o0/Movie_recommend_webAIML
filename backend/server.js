import express from "express";
import cors from "cors";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import os from "os";

dotenv.config();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("<h1>Backend is running successfully</h1>");
});

app.post("/recommend", (req, res) => {
  const movie = req.body.movie;

  // Correct path to Python script INSIDE the backend folder
  const scriptPath = path.resolve(__dirname, "./Model/artifacts/recommender.py");

  // auto-select python
  let pythonPath;

  if (os.platform() === "win32") {
    // WINDOWS FIX (You forgot '=' earlier)
    pythonPath = path.resolve(__dirname, "../venv/Scripts/python.exe");
  } else {
    pythonPath = "python3"; // Render/Linux
  }


  // Spawn the Python process
  const py = spawn(pythonPath, [scriptPath, movie]);

  let output = "";

  py.stdout.on("data", (data) => {
    output += data.toString();
  });

  py.stderr.on("data", (err) => {
    console.error("Python error:", err.toString());
  });

  py.on("close", () => {
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
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
