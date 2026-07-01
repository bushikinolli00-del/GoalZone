const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// 📁 frontend folder
const publicPath = path.join(__dirname, "public");

// serve static files (nëse ekzistojnë)
app.use(express.static(publicPath));

// 🏠 HOME ROUTE (SAFE)
app.get("/", (req, res) => {
  const indexFile = path.join(publicPath, "index.html");

  res.sendFile(indexFile, (err) => {
    if (err) {
      res.status(200).send(`
        ⚽ GoalZone Backend is LIVE <br/>
        ❌ Frontend nuk është gjetur (public/index.html mungon)
      `);
    }
  });
});

// ⚽ API ROUTE
app.get("/api/matches", async (req, res) => {
  try {
    const API_KEY = process.env.API_KEY;

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
    res.status(500).json({ error: "API error" });
  }
});

// ⚙️ PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("⚽ GoalZone running on", PORT);
});
