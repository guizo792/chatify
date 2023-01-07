const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');

const formatMessage = require('./utils/formatMessage');
const {
  joinUser,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require('./utils/users');

const app = express();
dotenv.config({ path: 'config/config.env' });

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketio(server);

// Setting static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Chat Bot';

// Declare chat credentials type
type ChatCredentials = {
  username: string;
  room: string;
};

// Run on client connect
io.on('connection', (socket: any) => {
  socket.on('joinRoom', (chatCredentials: ChatCredentials) => {
    // Extract chat infos
    const { username, room } = chatCredentials;

    const user = joinUser(socket.id, username, room);
    socket.join(user.room);
    // Welcome message (to the current user)
    socket.emit(
      'message',
      formatMessage(botName, `Welcome to ${user.room} chat`)
    );

    // Send message to everybody
    // io.emit("message", "hi everybody");

    // Broadcast when user connects (send to all users except the current)
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', (msg: string) => {
    const user = getCurrentUser(socket.id);

    io.emit('message', formatMessage(user.username, msg));
  });

  // When a client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );
      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => console.log(`🟢🏃🏻‍♂️ server running on port ${port}`));
