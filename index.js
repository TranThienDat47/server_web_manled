import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import db from './config/db/index.js';
import route from './routes/index.js';
import passport from './utils/passportOauthGoogle.js';

import { createServer } from 'http';

import { Server } from 'socket.io';

const app = express();

db.connectDB();
app.use(express.json());
app.use(cors());

route(app);

//passport

app.use(passport.initialize());

const PORT = 5000;
const PORT_SOCKET_IO = process.env.PORT_SOCKET_IO || 3006;

const server = createServer(app);
const socketio = new Server(server, {
   cors: {
      origins: '*:*',
      methods: ['GET', 'POST'],
   },
});

socketio.on('connection', (socket) => {
   console.log('user connect');
   socket.on('comment', (msg) => {
      socketio.emit('comment', msg);
   });
   socket.on('comment_reply', (msg) => {
      socketio.emit('comment_reply', msg);
   });

   socket.on('disconnect', () => {
      console.log('disconnect');
   });
});

app.listen(PORT, () => console.log(`Server started on ${PORT}`));

server.listen(PORT_SOCKET_IO, () => {
   console.log(`Socket IO server started on ${PORT_SOCKET_IO}`);
});
