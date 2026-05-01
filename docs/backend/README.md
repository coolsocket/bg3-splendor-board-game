# Backend Documentation

This directory contains documentation related to backend code architecture, real-time socket connections, database schemas (if any), and field definitions.

## Architecture

The BG3 Splendor Game uses a lightweight real-time server using `Socket.io` to synchronize game states across multiple connected clients.

## Real-Time Synchronization

- **Socket.io**: Used for broadcasting `state-sync` events.
- **State Merging**: The backend serves as a relay. Clients implement a "Filter-then-Merge" strategy, taking the `remoteState` from the backend and merging it with their local state while preserving local preferences (like `language`).

## Network Layer (Frontend)

See `src/network/README.md` for details on how the frontend connects to this backend.