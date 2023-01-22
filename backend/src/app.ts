const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

import { Request, Response, NextFunction } from 'express';

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const formatMessage = require('./utils/formatMessage');
const {
  joinUser,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require('./utils/users');
const userRouter = require('./routes/userRoutes');

const app = express();

// MIDDELWARES

// Http headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
// app.use(cors());

// Parsing body (reading data - body -> req.body)
app.use(express.json({ limit: '10kb' }));

// Parsing cookies
app.use(cookieParser());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(req.cookies);
  next();
});

// app.use(function (req: Request, res: Response, next: NextFunction) {
//   res.header('Content-Type', 'application/json;charset=UTF-8');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept'
//   );
//   next();
// });

// Sanitizing data against NoSQL query injection
app.use(mongoSanitize());

// Sanitizing data against xss
app.use(xssClean());

// Avoid parameter pollution
app.use(hpp());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const rateLimiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', rateLimiter);

// Setting static folder
app.use(express.static(path.join(__dirname, 'public')));

// SERVER
const server = http.createServer(app);

// SOCKET (allow cors to our frontend app)
const io = socketio(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
});

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

// ROUTES
app.use('/api/v1/users', userRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = server;
