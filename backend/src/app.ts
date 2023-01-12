import { Request, Response, NextFunction } from 'express';

const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const formatMessage = require('./utils/formatMessage');
const {
  joinUser,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require('./utils/users');

const app = express();

app.use(cors());
app.use(express.json());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
});

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

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = server;
