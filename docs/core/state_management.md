# State Management & Synchronization Map

This document details the structure of the Zustand stores and the multi-window synchronization protocol.

## 1. Store Topology

### 1.1. Global State: `useGameStateStore`
The source of truth for the game board.
- **Synced Logic**: Uses `sequenceNumber` (Int) for versioning.
- **Synced Properties**:
    - `players`, `currentPlayerIndex`, `availableResources`, `faceUpCards`, `decks`, `phase`, `turnNumber`.
    - `isAnimationLocked`: Critical UI lock that is synced to ensure all clients wait for transitions.
    - `discardingInfo`: Global tracking for players currently over the 10-token limit.
- **Sync Method**: `dispatchAction(action)` broadcasts the intent; receiving clients apply the logic.

### 1.2. Local Preferences
- `language`: 'ZH' | 'EN' (Stored in `useGameStateStore` but excluded from sync).
- `useAudioStore`: Manages local volume and playlist state.
- `usePlayerStore`: Stores the local player's identity (`name`).

---

## 2. Synchronization Protocol: Action-Bus & Sequence Guards

To solve the "Delayed Snapshot Reversion" problem, the system implements a strict ordering protocol:

1.  **State Increment**: Every mutation (`TAKE_TOKENS`, `BUY_CARD`, `setAnimationLocked`) increments the `sequenceNumber`.
2.  **Snapshot Inbound**:
    ```typescript
    if (remoteState.sequenceNumber <= localState.sequenceNumber) {
        return; // Reject stale data
    }
    ```
3.  **Action Inbound**: `game-action` events are processed through the same `dispatchAction` logic on all clients, ensuring deterministic results.

---

## 3. Resilience Mechanisms

- **Window Focus Catch-up**: When a user returns to a background tab, the window automatically requests a full state sync to align with the current `sequenceNumber`.
- **Host Heartbeat**: The first player in the room (Host) emits a full state sync every 5 seconds as a safety net for any dropped action packets.
- **Session Filtering**: Every message carries a `sessionId`. Clients ignore messages from their own session to prevent infinite feedback loops.
