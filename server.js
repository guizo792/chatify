const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Setting static folder
app.use(express.static(path.join(__dirname, "public")));

// Run on client connect
io.on("connection", (socket) => {
  console.log("⚡ new ws connection...");

  // Welcome message
  socket.emit("message", "Welcome to chat");

  // Broadcast when user connects
  socket.broadcast.emit("message", "A user has joined the chat");

  // when a client disconnects
  socket.on("disconnect", () => {
    io.emit("message", "A user has left the chat");
  });
});

const port = 3000 || process.env.PORT;

server.listen(port, () => console.log(`🟢 server running on port ${port}`));
