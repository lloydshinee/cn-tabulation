// websocket/index.js

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// keep track of clients by role
const connections = {
  ADMIN: new Set(),
  JUDGE: new Map(), // store judges as userId -> socketId
};

// updated scoring state → arrays
let scoringState = {
  teams: [],
  portions: [], // { id, name, hiddenCriterias: [] }
  start: false,
};

// helper: broadcast judges list
function broadcastJudges() {
  const judges = Array.from(connections.JUDGE.keys()); // list of userIds
  io.emit("judgesList", judges);
}

io.on("connection", (socket) => {
  const { role, userId } = socket.handshake.query;
  console.log(`⚡ New connection: ${socket.id} as ${role} (userId: ${userId})`);

  if (role === "ADMIN") {
    connections.ADMIN.add(socket.id);
    // Send the current judges list to this admin right away
    socket.emit("judgesList", Array.from(connections.JUDGE.keys()));
  } else if (role === "JUDGE") {
    if (userId) {
      connections.JUDGE.set(userId, socket.id);
    }
  }

  broadcastJudges(); // update everyone
  // Always send current scoring state
  socket.emit("scoringState", scoringState);

  socket.on("updateScoring", (data) => {
    if (role !== "ADMIN") {
      console.warn(`❌ Unauthorized update attempt by ${socket.id}`);
      return;
    }

    if (data.start === false) {
      // Stop scoring → reset everything
      scoringState = { teams: [], portions: [], start: false };
    } else {
      // Ensure portions are normalized to { id, hiddenCriterias }
      if (Array.isArray(data.portions)) {
        scoringState.portions = data.portions.map((p) =>
          typeof p === "object"
            ? {
                id: p.id,
                name: p.name || "", // 👈 preserve name
                hiddenCriterias: p.hiddenCriterias || [],
              }
            : { id: p, name: "", hiddenCriterias: [] }
        );
      }

      // Merge other keys like teams/start
      scoringState = {
        ...scoringState,
        ...data,
        portions: scoringState.portions, // keep normalized
      };

      // If no portions, clear teams too
      if (scoringState.portions.length === 0) {
        scoringState.teams = [];
      }
    }

    console.log("✅ Updated scoring state:", scoringState);
    io.emit("scoringState", scoringState);
  });

  socket.on("disconnect", () => {
    console.log(`🔌 Disconnected: ${socket.id}`);
    connections.ADMIN.delete(socket.id);

    // remove judge by socketId
    for (const [userId, sId] of connections.JUDGE.entries()) {
      if (sId === socket.id) {
        connections.JUDGE.delete(userId);
        break;
      }
    }

    broadcastJudges(); // update everyone
  });
});

app.get("/", (_req, res) => {
  res.send("Scoring WebSocket server is running.");
});

const PORT = 3003;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on ${PORT}`);
});
