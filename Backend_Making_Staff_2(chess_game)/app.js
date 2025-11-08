const express = require('express');
const socket = require('socket.io');
const path = require('path');
const http = require('http');
const { Chess } = require('chess.js');

const app = express();
const server = http.createServer(app);
const io = socket(server);
const chess = new Chess();

let players = {}; // { white: socketId, black: socketId }
let currentPlayer = "w"; // lowercase matches chess.js turn()

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { title: "Chess Game" });
});

io.on("connection", (uniquesocket) => {
  console.log("A user connected:", uniquesocket.id);

  // Assign players
  if (!players.white) {
    players.white = uniquesocket.id;
    uniquesocket.emit("playerRole", "w");
    console.log("Assigned White:", uniquesocket.id);
  } else if (!players.black) {
    players.black = uniquesocket.id;
    uniquesocket.emit("playerRole", "b");
    console.log("Assigned Black:", uniquesocket.id);
  } else {
    uniquesocket.emit("spectatorRole");
    console.log("Assigned Spectator:", uniquesocket.id);
  }

  // Handle disconnect
  uniquesocket.on("disconnect", () => {
    console.log("Disconnected:", uniquesocket.id);
    if (uniquesocket.id === players.white) {
      delete players.white;
      console.log("White disconnected");
    } else if (uniquesocket.id === players.black) {
      delete players.black;
      console.log("Black disconnected");
    }
  });

  // Handle move event
  uniquesocket.on("move", (move) => {
    try {
      // Validate whose turn it is
      if (chess.turn() === "w" && uniquesocket.id !== players.white) {
        return;
      }
      if (chess.turn() === "b" && uniquesocket.id !== players.black) {
        return;
      }

      const result = chess.move(move);

      if (result) {
        currentPlayer = chess.turn();
        io.emit("move", move);
        io.emit("boardState", chess.fen());
      } else {
        console.log("Invalid move:", move);
        uniquesocket.emit("invalidMove", move);
      }
    } catch (err) {
      console.error("Move error:", err);
      uniquesocket.emit("errorMessage", "Invalid move format or internal error.");
    }
  });
});

server.listen(3000, function () {
  console.log("Listening on port 3000");
});
