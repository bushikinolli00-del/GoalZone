const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// ⚠️ SAFE: serve frontend only if folder exists
const publicPath = path.join(__dirname, "public");

// vetëm nëse ekziston public folder
app.use(express.static(publicPath));

// 🟢 HOME ROUTE
app.get("/", (req, res) => {
  res.send("⚽ GoalZone Backend is LIVE");
});

// ⚽ API ROUTE
app.get("/api/matches", async (req, res) => {
  try {
    const API_KEY = process.env.API_KEY;

    if (!API_KEY) {
      return res.status(500).json({
        error: "API_KEY missing in environment variables"
      });
    }

    const response = await axios.get(
      "https://v3.football.api-sports.io/fixtures?live=all",
      {
        headers: {
          "x-apisports-key": API_KEY
        }
      }
    );

    res.json(response.data.response || []);

  } catch (err) {
    console.log("API ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch matches" });
  }
});

// ⚙️ PORT (Render fix)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("⚽ Server running on port", PORT);
});
