const express = require("express");
const http = require("http");
const cors = require("cors");
const axios = require("axios");
const path = require("path");
const socketIo = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" }
});

app.use(express.static(path.join(__dirname, "public")));

// HOME
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API
async function fetchMatches() {
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

// LIVE + GOAL DETECTION
let lastData = [];

setInterval(async () => {
  const data = await fetchMatches();

  // goal detection
  data.forEach((m) => {
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
io.on("connection", (socket) => {
  console.log("Client connected");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("GoalZone running on", PORT));
