# Plan: Sync Heartbeat & GCS Migration

## 1. Create Probe
Write `test_heartbeat.mjs` to verify that state changes in Client A are eventually picked up by Client B even if no manual sync event is triggered (simulating a dropped packet).

## 2. Implement Sync Heartbeat
- Update `gameStateStore.ts` to include a 5-second `setInterval`.
- Designate the first player in the list as the "Host" responsible for heartbeats.
- Heartbeats should only send if `!isReceiving`.

## 3. Migrate Images to GCS
- Use the already generated `assetMapping.json`.
- Update `assetRepository.ts`:
    - Remove `import.meta.glob`.
    - Change `getArt(assetId)` to use `https://storage.googleapis.com/bg3-splendor-static-assets/cards/${mapping[assetId]}`.
- Update `.gcloudignore` to exclude `src/assets/cards/`.

## 4. Update Music Playlist
- Find 4 more tracks or replace the set with 10 top tracks.
- Download and upload to `gs://bg3-splendor-audio-assets/audio/`.
- Update `audioStore.ts`.

## 5. Verify
Run probe. Verify RED -> fix -> GREEN.