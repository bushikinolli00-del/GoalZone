const express = require("express");
const http = require("http");
const cors = require("cors");
const axios = require("axios");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" }
});

// serve frontend
app.use(express.static(path.join(__dirname, "public")));

// homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API (backup)
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
    res.status(500).json({ error: "API error" });
  }
});

// REALTIME LOOP
async function getMatches() {
  try {
    const API_KEY = process.env.API_KEY;

    const res = await axios.get(
      "https://v3.football.api-sports.io/fixtures?live=all",
      {
        headers: {
          "x-apisports-key": API_KEY
        }
      }
    );

    return res.data.response || [];
  } catch {
    return [];
  }
}

// send updates every 5 sec
setInterval(async () => {
  const data = await getMatches();
  io.emit("liveMatches", data);
}, 5000);

// socket connection
io.on("connection", (socket) => {
  console.log("Client connected ⚡");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("GoalZone Realtime running on", PORT);
});
