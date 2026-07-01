const express = require("express");
const http = require("http");
const cors = require("cors");
const axios = require("axios");
const socketIo = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

// serve frontend
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("GoalZone LIVE ⚽");
});

const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" }
});

// fetch live matches
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
  } catch (err) {
    console.log("API ERROR:", err.message);
    return [];
  }
}

// REAL TIME PUSH
setInterval(async () => {
  const data = await getMatches();
  io.emit("matches", data);
}, 5000);

// SOCKET
io.on("connection", (socket) => {
  console.log("Client connected");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Server running", PORT));
