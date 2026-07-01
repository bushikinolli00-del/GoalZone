const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// 🔥 serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// 🟢 home route (website)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ⚽ API route (live matches)
app.get("/api/matches", async (req, res) => {
  try {
    const API_KEY = process.env.API_KEY;

    if (!API_KEY) {
      return res.status(500).json({ error: "API_KEY missing in ENV" });
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

// ⚙️ PORT (Render required)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("⚽ GoalZone running on port", PORT);
});
