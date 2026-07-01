const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.static("public"));

const API_KEY = "YOUR_API_KEY";

// LIVE MATCHES API
app.get("/api/matches", async (req, res) => {
  try {
    const result = await axios.get(
      "https://v3.football.api-sports.io/fixtures?live=all",
      {
        headers: { "x-apisports-key": API_KEY }
      }
    );

    res.json(result.data.response);
  } catch (err) {
    res.json([]);
  }
});

app.listen(3000, () => console.log("GoalZone running on 3000"));
