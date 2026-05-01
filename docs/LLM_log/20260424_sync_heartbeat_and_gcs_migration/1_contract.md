# Contract: Sync Heartbeat & GCS Asset Migration

## Context (Entry)
1. **Sync Instability**: Actions sometimes fail to propagate. A 5-second heartbeat will ensure all clients converge to the same state even if transient network failures occur.
2. **Slow Asset Loading**: Remote players experience high latency loading 280MB+ of card images from the app server. Moving these to a GCS bucket with global CDN is necessary.
3. **Music Refresh**: Replace the long BGM with a curated list of ~10 high-quality tracks.

## Definition of Done (Exit)
1. **Sync Heartbeat**:
    - `gameStateStore.ts`: Implement `useEffect` or interval-based broadcast of the full state every 5 seconds.
    - Version check (timestamp) ensures old heartbeats don't overwrite new user actions.
2. **GCS Migration**:
    - Upload all images in `src/assets/cards/` to `gs://bg3-splendor-static-assets/cards/`.
    - Update `assetRepository.ts` to use the GCS URL for card art.
    - Update `.gcloudignore` to exclude the large local assets folder.
3. **Music Update**:
    - Curate 10 tracks, upload to GCS, and update `audioStore.ts`.
4. **Verification**:
    - Probe `test_heartbeat.mjs` confirms state synchronization via heartbeat.
    - Visual check confirms images load from GCS (checked via network tab simulation in probe).