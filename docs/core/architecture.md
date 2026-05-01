# Architecture & State Topology

This document outlines the industrialized, decoupled architecture of BG3 Splendor, focusing on multi-window synchronization and physical UI integrity.

## 1. Strict Layered Architecture

### A. Domain Layer (`src/domain`)
- **Responsibility**: Pure business logic and Splendor rule enforcement.
- **Pure Logic**: Functions accept `GameState` and return `GameResult`. No store dependencies.
- **Action Bus**: All gameplay mutations are defined as `GameAction` types.

### B. Store Layer (`src/store`)
- **Responsibility**: State persistence and **Synchronized Truth**.
- **Action-Bus Architecture**: Instead of just syncing snapshots, the system prioritizes broadcasting *Actions*.
- **Strict Sequencing**: Every state update increments a `sequenceNumber`. Incoming syncs with lower or equal sequence numbers are rejected to prevent "Turn Reversion" bugs.
- **Synced Locks**: `isAnimationLocked` is now globally synced, ensuring all players stay in sync during cinematic transitions.

### C. UI Layer (`src/components`)
- **Responsibility**: High-fidelity physical rendering and user interaction.
- **Atmospheric**: State transitions trigger high-precision animations (TokenTransfer, CardFlight) using Framer Motion and synced timing.

---

## 2. Multi-Player Sync Protocol (Action-Bus)

The synchronization engine uses `Socket.io` with the following resilience features:

1.  **Sequence Guard**: Prevents old heartbeats or delayed snapshots from overwriting newer turn transitions.
2.  **Session Isolation**: Uses `SESSION_ID` to prevent a client from processing its own echoed broadcasts.
3.  **Active/Passive Sync**:
    - **Active**: `dispatchAction` sends immediate updates.
    - **Passive**: 5-second Host heartbeat and window `focus` events trigger catch-up requests.

---

## 3. Asset Pipeline: Cloud CDN Strategy

To maintain a lightweight Docker image (under 10MB), all heavy assets (280MB+) are moved to **Google Cloud Storage (GCS)**.

- **Storage**: `gs://bg3-splendor-static-assets` (Hong Kong).
- **Resolution**: `AssetRepository` dynamically maps internal `assetId` to public CDN URLs.
- **Zero-Local Policy**: No `.png`, `.jpg`, or `.mp3` files are stored in the git repository (except for essential UI textures).
