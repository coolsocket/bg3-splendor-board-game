# Network Layer

This directory contains network communication logic, specifically for WebSockets, to handle real-time synchronization with the server.

## Main Files

-   `NetworkManager.ts`: Handles connecting to the WebSocket server, sending messages, and listening for incoming events.

## Architectural Role

The Network Layer handles real-time synchronization with the server.
-   It is responsible for all external communication.
-   It should notify the Store Layer (`src/store`) of incoming events from the server.
-   The Store Layer may also use the Network Manager to send actions performed by the user to the server.
-   This ensures that the game state is synchronized across all clients.

Refer to `implementation_plan.md` for the industrialization principles regarding the Network Layer.
