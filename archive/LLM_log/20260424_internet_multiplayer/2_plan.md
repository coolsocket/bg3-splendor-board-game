# Plan: Internet Multiplayer Migration

## 1. Safety & Preservation
- Copied `src/store/gameStateStore.ts` to `src/store/backups/gameStateStore.broadcast.ts.bak`.

## 2. Infrastructure (Node.js Server)
- Run `npm install socket.io socket.io-client`.
- Create `server/index.js` which sets up an Express/Socket.IO server.
  - Listen on port `3001` (or `$PORT` for future deployment).
  - Handle `connection`, `join-room`, `state-sync`, and `animation-event`.
  - When a client emits `state-sync`, broadcast it to `socket.to(room).emit('state-sync', state)`.

## 3. Frontend Integration
- In `src/store/gameStateStore.ts`:
  - Replace `new BroadcastChannel(...)` with `io('http://localhost:3001')` (we will make this configurable via env var `import.meta.env.VITE_WS_URL`).
  - Extract room name from `window.location.search` (e.g. `?room=lobby1`). Default to `"global"` if missing.
  - Emit `join-room` on connection.
  - Subscribe to `state-sync` and `animation-event` exactly as we did with `BroadcastChannel`.
  - When Zustand state changes, emit `state-sync` instead of `bc.postMessage`.

## 4. Testing Phase (RED)
- Write `test_socket.mjs` in `tests/llm_probes/20260424_internet_multiplayer/`.
- The probe will attempt to connect two Playwright browser pages to `http://localhost:4173/?room=test_probe`.
- Page 1 clicks a token, Page 2 checks if its Zustand store updated via WebSocket.

## 5. Execution Phase (GREEN)
- Build and run the server + frontend.
- Let the probe verify the socket sync.
- Success means true internet multiplayer is achieved.