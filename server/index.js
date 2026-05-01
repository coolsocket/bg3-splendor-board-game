import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // allow all for simplicity in this demo
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log(`[SOCKET] User connected: ${socket.id}`);

  // When a client requests to join a specific room
  socket.on('join-room', (roomName) => {
    socket.join(roomName);
    console.log(`[SOCKET] User ${socket.id} joined room: ${roomName}`);
    // Notify others a new player joined to trigger a state sync request
    socket.to(roomName).emit('player-joined', { socketId: socket.id });
  });

  // When a client requests full state
  socket.on('request-full-state', ({ room }) => {
    // Forward to everyone else in the room
    socket.to(room).emit('request-full-state');
    console.log(`[SOCKET] request-full-state for room ${room}`);
  });

  // When a client broadcasts a state sync
  socket.on('state-sync', ({ room, state }) => {
    const start = performance.now();
    const payloadSize = JSON.stringify(state).length;
    // Broadcast to everyone else in the same room
    socket.to(room).emit('state-sync', state);
    const duration = (performance.now() - start).toFixed(2);
    console.log(`[OBSERVABILITY] state-sync for room ${room} took ${duration}ms, size: ${payloadSize} bytes`);
  });

  // When a client broadcasts an animation event
  socket.on('animation-event', ({ room, eventName, detail }) => {
    const start = performance.now();
    // Broadcast to everyone else in the same room
    socket.to(room).emit('animation-event', { eventName, detail });
    const duration = (performance.now() - start).toFixed(2);
    console.log(`[OBSERVABILITY] animation-event (${eventName}) for room ${room} took ${duration}ms`);
  });

  // When a client broadcasts a game action
  socket.on('game-action', ({ room, action }) => {
    // Broadcast to everyone else in the same room
    socket.to(room).emit('game-action', action);
    console.log(`[SOCKET] game-action (${action.type}) for room ${room}`);
  });

  socket.on('disconnect', () => {
    console.log(`[SOCKET] User disconnected: ${socket.id}`);
  });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 BG3 Splendor Backend running on port ${PORT}`);
});