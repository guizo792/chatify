const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const formatMessage = require("./utils/formatMessage");
const {
  joinUser,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Setting static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "Chat Bot";

// Run on client connect
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = joinUser(socket.id, username, room);
    socket.join(user.room);
    // Welcome message (to the current user)
    socket.emit(
      "message",
      formatMessage(botName, `Welcome to ${user.room} chat`)
    );

    // Send message to everybody
    // io.emit("message", "hi everybody");

    // Broadcast when user connects (send to all users except the current)
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    io.emit("message", formatMessage(user.username, msg));
  });

  // When a client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );
      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const port = 3000 || process.env.PORT;

server.listen(port, () => console.log(`🟢 server running on port ${port}`));
