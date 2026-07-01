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

// MATCHES
async function fetchMatches() {
  const API_KEY = process.env.API_KEY;

  const res = await axios.get(
    "https://v3.football.api-sports.io/fixtures?live=all",
    { headers: { "x-apisports-key": API_KEY } }
  );

  return res.data.response || [];
}

// MATCH LIST API
app.get("/api/matches", async (req, res) => {
  const data = await fetchMatches();
  res.json(data);
});

// SINGLE MATCH API
app.get("/api/match/:id", async (req, res) => {
  try {
    const API_KEY = process.env.API_KEY;

    const resApi = await axios.get(
      `https://v3.football.api-sports.io/fixtures?id=${req.params.id}`,
      { headers: { "x-apisports-key": API_KEY } }
    );

    res.json(resApi.data.response[0]);
  } catch {
    res.status(500).json({ error: "match error" });
  }
});

// LIVE SOCKET
let lastData = [];

setInterval(async () => {
  const data = await fetchMatches();

  // goal detection
  data.forEach(m => {
    const old = lastData.find(x => x.fixture.id === m.fixture.id);

    if (old) {
      if (old.goals.home !== m.goals.home || old.goals.away !== m.goals.away) {
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

// SOCKET
io.on("connection", () => {
  console.log("client connected");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("GoalZone LIVE"));
