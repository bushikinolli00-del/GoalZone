const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const API_KEY = process.env.API_KEY;

app.get("/api/matches", async (req, res) => {
  try {
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
    res.json([]);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
