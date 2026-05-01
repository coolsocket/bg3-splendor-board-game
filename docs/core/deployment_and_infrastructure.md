# Deployment & Cloud Infrastructure

BG3 Splendor is deployed as a high-performance, containerized application with a geographically optimized footprint for the Asia-Pacific region.

## 1. Hosting: Google Cloud Run (Hong Kong)

The application is hosted on **Google Cloud Run** in the `asia-east1` (Hong Kong) region to minimize latency for players.

- **Frontend/Backend**: Unified container running Node.js 20.
- **Scaling**: Configured for `min-instances: 1` to prevent cold starts during multiplayer sessions.
- **Protocol**: Supports HTTP/2 and WebSockets (Socket.io) for real-time state synchronization.

## 2. Global Asset Delivery (GCS + CDN)

To maintain ultra-fast deployment cycles and minimize container size, all high-resolution art and audio are decoupled from the source code.

- **Storage Bucket**: `gs://bg3-splendor-static-assets`
- **Asset Types**:
    - **Cards**: 180+ stylized character portraits.
    - **Audio**: Ambient BGM and spell-casting sound effects.
    - **UI**: High-resolution parchment and metal textures.
- **Resolution Strategy**: The `AssetRepository` in the client resolve paths to the GCS public URL. This reduces the Docker image size from ~300MB to ~10MB.

## 3. Multiplayer Backend (`server/index.js`)

A lightweight Express + Socket.io server handles room management.

- **Rooms**: Players are grouped into rooms based on a `?room=` URL parameter (defaults to `global`).
- **Events**:
    - `join-room`: Assigns socket to a specific game session.
    - `game-action`: Broadcasts granular actions (`TAKE_TOKENS`, etc.).
    - `state-sync`: Broadcasts full state snapshots for late joiners and heartbeats.
    - `animation-event`: Synchronizes non-stateful visual triggers.

## 4. CI/CD & Deployment Process

Deployment is handled via `scripts/deploy_observed.sh`:
1.  **Build**: Vite production build.
2.  **Asset Check**: Ensures `assetMapping.json` points to valid remote assets.
3.  **Deploy**: Pushes source code to Cloud Run.
4.  **Verification**: Automated health check of the Hong Kong endpoint.
