# Contract: Migrate Audio to GCS

## Context (Entry)
The user noticed that the BGM audio still occasionally fails to play on Cloud Run, likely because Nginx inside the Alpine Docker container struggles to buffer and stream large media files over HTTP range requests. To definitively solve this and optimize the container, all audio assets must be migrated to a Google Cloud Storage (GCS) bucket, allowing the browser to stream them directly from Google's global CDN infrastructure.

## Definition of Done (Exit)
1. **Automated Probe (`tests/llm_probes/20260424_migrate_audio_gcs/test_audio.mjs`)**: A script that verifies the audio URLs in the application point to a `storage.googleapis.com` domain instead of relative `/assets/` paths, and checks that the audio successfully loads.
2. **Implementation**:
    - Create a public GCS bucket (`gs://bg3-splendor-audio-assets`).
    - Configure CORS on the bucket so Howler.js can fetch the tracks.
    - Upload all `.mp3` files from `public/assets/audio/` to the bucket.
    - Update `src/store/audioStore.ts` to reference the absolute GCS URLs.
    - Redeploy the application.
3. **Assertion**: The probe must return 0, confirming that the audio store uses GCS URLs and the tracks load without 500 errors.