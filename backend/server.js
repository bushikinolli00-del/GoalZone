const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());

// TEST ROUTE (me pa a punon serveri)
app.get("/", (req, res) => {
  res.send("⚽ GoalZone Backend is LIVE");
});

// LIVE MATCHES API
app.get("/api/matches", async (req, res) => {
  try {
    const API_KEY = process.env.API_KEY;

    const result = await axios.get(
      "https://v3.football.api-sports.io/fixtures?live=all",
      {
        headers: {
          "x-apisports-key": API_KEY
        }
      }
    );

    res.json(result.data.response || []);
  } catch (err) {
    console.log("ERROR:", err.message);
    res.status(500).json({ error: "API failed" });
  }
});

// PORT (RENDER FIX)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("⚽ Server running on port", PORT);
});
