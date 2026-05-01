# Contract: Internet Multiplayer Migration

## Context (Entry)
The game currently relies on the browser-native `BroadcastChannel` for syncing state across tabs. The user wants to replace this with a true internet-capable backend using WebSockets, allowing players on different devices and networks to play together. The old local logic must be safely backed up.

## Definition of Done (Exit)
1. **Automated Probe (`tests/llm_probes/20260424_internet_multiplayer/test_socket.mjs`)**: A script that starts the Node.js backend server and connects a headless Playwright browser to ensure socket connections are established and state updates are relayed.
2. **Implementation**:
    - Backup the old `BroadcastChannel` code (completed).
    - Install `socket.io` and `socket.io-client`.
    - Create a lightweight `server/index.js` Node.js server that manages rooms and broadcasts state updates to clients in the same room.
    - Rewrite the multiplayer sync logic in `src/store/gameStateStore.ts` to use `socket.io-client`.
    - Allow users to specify a room via a URL query parameter (e.g., `?room=test`).
    - Update `package.json` to include a script to run the server.
3. **Assertion**: The automated probe successfully connects, emits a state change, and receives it back, exiting with code 0.