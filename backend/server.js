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

// HOME
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// MATCH DETAILS
app.get("/api/match/:id", async (req, res) => {
  try {
    const API_KEY = process.env.API_KEY;

    const r = await axios.get(
      `https://v3.football.api-sports.io/fixtures?id=${req.params.id}`,
      {
        headers: { "x-apisports-key": API_KEY }
      }
    );

    res.json(r.data.response?.[0] || {});
  } catch {
    res.json({});
  }
});

// LINEUPS FIX (IMPORTANT)
app.get("/api/lineups/:id", async (req, res) => {
  try {
    const API_KEY = process.env.API_KEY;

    const r = await axios.get(
      `https://v3.football.api-sports.io/fixtures/lineups?fixture=${req.params.id}`,
      {
        headers: { "x-apisports-key": API_KEY }
      }
    );

    res.json(r.data.response || []);
  } catch {
    res.json([]);
  }
});

// LIVE MATCHES
async function getLive() {
  try {
    const API_KEY = process.env.API_KEY;

    const r = await axios.get(
      "https://v3.football.api-sports.io/fixtures?live=all",
      {
        headers: { "x-apisports-key": API_KEY }
      }
    );

    return r.data.response || [];
  } catch {
    return [];
  }
}

// SOCKET LIVE LOOP
let oldData = [];

setInterval(async () => {
  const data = await getLive();

  // goal detect
  data.forEach(m => {
    const old = oldData.find(x => x.fixture.id === m.fixture.id);

    if (old) {
      if (old.goals.home !== m.goals.home || old.goals.away !== m.goals.away) {
        io.emit("goalEvent", {
          match: `${m.teams.home.name} vs ${m.teams.away.name}`,
          score: `${m.goals.home}-${m.goals.away}`
        });
      }
    }
  });

  oldData = data;
  io.emit("liveMatches", data);
}, 5000);

// SOCKET
io.on("connection", () => {
  console.log("client connected");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("GoalZone LIVE"));
