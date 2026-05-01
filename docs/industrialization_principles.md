# Industrialization Principles: BG3 Splendor

This project follows strict engineering principles to ensure that a complex, cinematic multiplayer game remains maintainable and robust.

## 1. Domain-Driven Decoupling
- **Principle**: The "Brain" (logic) must not know about the "Body" (UI) or the "Nervous System" (Networking).
- **Implementation**:
    - `src/domain/` contains only pure functions and interfaces.
    - No `import` from `react` or `zustand` is allowed in the domain layer.
    - Result: Rules can be tested with 100% reliability in pure Node.js environments.

## 2. Action-Bus over Snapshot-Sync
- **Principle**: Communicate "Intent", not "State".
- **Implementation**:
    - Instead of sending the whole state every time a token is picked, we send the `GameAction`.
    - Every client runs the same deterministic logic locally.
    - Result: Dramatically reduced bandwidth and eliminated "Snapshot Echo" bugs (where old state overwrites new actions).

## 3. Strict Sequence Ordering (The Seq Guard)
- **Principle**: Distributed systems require strict time-ordering.
- **Implementation**:
    - Every state update increments a `sequenceNumber`.
    - Incoming syncs are compared: `if (remote.seq <= local.seq) ignore()`.
    - Result: Even if network packets arrive out of order, the game never "rolls back" in time.

## 4. Zero-Asset Deployment
- **Principle**: Docker images should be logic-only, assets should be cloud-only.
- **Implementation**:
    - All high-res images (280MB+) are stored in **Google Cloud Storage (GCS)**.
    - `AssetRepository` resolves internal IDs to CDN URLs.
    - Result: Deployment time reduced from minutes to seconds; container size reduced by 95%.

## 5. CSS Material System
- **Principle**: Visual styles must be managed via a centralized material palette, not inline hex codes.
- **Implementation**:
    - Global variables in `index.css` define `parchment`, `gold`, `obsidian`, and `gem` gradients.
    - Components use semantic classes like `bg3-panel` or `cost-radiant_gem`.
    - Result: A cohesive, immersive aesthetic that can be tuned from a single file.

## 6. Physicality-First UI
- **Principle**: The UI should feel like a tabletop game, not a website.
- **Implementation**:
    - Cinematic turn transitions (`TurnAnnouncer`) use full-screen overlays and synced animation locks.
    - High-fidelity physical rendering (layered DIVs, custom blend modes) simulates real materials.
    - Result: High immersion and cohesive aesthetic.
