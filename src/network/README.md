# Network Layer

This directory contains the logic for network communication and real-time synchronization in the BG3 Splendor game.

## Main Files

- `NetworkManager.ts`: The central service for WebSocket communication. It provides:
    - **Connection Management**: Handling WebSocket lifecycle (connect, disconnect, reconnect).
    - **Message Dispatching**: Sending local player actions to the server.
    - **Event Handling**: Listening for server-side updates (e.g., opponent moves, game start) and updating local stores.
    - **Synchronization**: Ensuring the local `GameState` remains consistent with the server's authoritative state.

## Architectural Role

The Network Layer acts as the application's gateway to the outside world.
1. **Side Effect Isolation**: All networking side effects are confined to this layer.
2. **Store Integration**: It interacts with `src/store` to push updates into the application state and pull state for outgoing messages.
3. **Abstraction**: Higher-level components and hooks use the `NetworkManager` without needing to know the details of the underlying protocol (WebSockets).

## Principles

- **Authoritative Server**: The client sends "intentions" (actions), but the server returns the "truth" (new state).
- **Resilience**: The manager should handle network interruptions gracefully.
- **Latency Compensation**: (Future) Potential for optimistic UI updates before server confirmation.
