const express = require("express");
const http = require("http");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
const socketIo = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

app.use(express.static(path.join(__dirname, "public")));

// =====================
// FRONTEND
// =====================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// =====================
// LIVE MATCHES
// =====================
app.get("/api/matches", async (req, res) => {
  try {
    const API_KEY = process.env.API_KEY;

    const response = await axios.get(
      "https://v3.football.api-sports.io/fixtures?live=all",
      {
        headers: { "x-apisports-key": API_KEY }
      }
    );

    res.json(response.data.response || []);
  } catch (err) {
    res.json([]);
  }
});

// =====================
// SINGLE MATCH
// =====================
app.get("/api/match/:id", async (req, res) => {
  try {
    const API_KEY = process.env.API_KEY;

    const response = await axios.get(
      `https://v3.football.api-sports.io/fixtures?id=${req.params.id}`,
      {
        headers: { "x-apisports-key": API_KEY }
      }
    );

    res.json(response.data.response?.[0] || {});
  } catch (err) {
    res.json({});
  }
});

// =====================
// LINEUPS (PLAYERS)
// =====================
app.get("/api/lineups/:id", async (req, res) => {
  try {
    const API_KEY = process.env.API_KEY;

    const response = await axios.get(
      `https://v3.football.api-sports.io/fixtures/lineups?fixture=${req.params.id}`,
      {
        headers: { "x-apisports-key": API_KEY }
      }
    );

    res.json(response.data.response || []);
  } catch (err) {
    res.json([]);
  }
});

// =====================
// LIVE SOCKET SYSTEM
// =====================
let lastData = [];

async function fetchLive() {
  try {
    const API_KEY = process.env.API_KEY;

    const res = await axios.get(
      "https://v3.football.api-sports.io/fixtures?live=all",
      {
        headers: { "x-apisports-key": API_KEY }
      }
    );

    return res.data.response || [];
  } catch {
    return [];
  }
}

setInterval(async () => {
  const data = await fetchLive();

  // GOAL DETECTION
  data.forEach(m => {
    const old = lastData.find(x => x.fixture.id === m.fixture.id);

    if (old) {
      if (
        old.goals.home !== m.goals.home ||
        old.goals.away !== m.goals.away
      ) {
        io.emit("goalEvent", {
          match: `${m.teams.home.name} vs ${m.teams.away.name}`,
          score: `${m.goals.home}-${m.goals.away}`
        });
      }
    }
  });

  lastData = data;

  io.emit("liveMatches", data);
}, 5000);

// =====================
// SOCKET CONNECT
// =====================
io.on("connection", (socket) => {
  console.log("Client connected");
});

// =====================
// START SERVER
// =====================
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("⚽ GoalZone Backend LIVE");
});
