const express = require("express");
const axios = require("axios");
const cors = require("cors");
const http = require("http");
const path = require("path");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// 🔥 SAFE static folder (nuk crash-on nëse mungon)
const publicPath = path.join(__dirname, "public");

// vetëm nëse ekziston, e përdor
app.use(express.static(publicPath));

// 🟢 HOME ROUTE (SAFE)
app.get("/", (req, res) => {
  const indexFile = path.join(publicPath, "index.html");

  res.sendFile(indexFile, (err) => {
    if (err) {
      // fallback nëse nuk ekziston frontend
      res.send("⚽ GoalZone Backend is LIVE (NO FRONTEND YET)");
    }
  });
});

// ⚽ API MATCHES
app.get("/api/matches", async (req, res) => {
  try {
    const API_KEY = process.env.API_KEY;

    if (!API_KEY) {
      return res.status(500).json({ error: "Missing API_KEY" });
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
    console.log(err.message);
    res.status(500).json({ error: "API failed" });
  }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("⚽ GoalZone running on port", PORT);
});
