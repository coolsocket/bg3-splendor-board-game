# Plan: Migrate Audio to GCS

## 1. GCS Bucket Setup
- Use `gcloud` (with bypassed proxies and using the service account) to create a bucket named `gs://bg3-splendor-audio-assets` in `my-website-417013`.
- Set the IAM policy to make it publicly readable: `allUsers -> roles/storage.objectViewer`.
- Set CORS to allow `GET` requests from any origin so Howler.js can fetch the audio chunks without cross-origin errors.

## 2. Asset Upload
- Upload all `.mp3` files in `public/assets/audio/` to `gs://bg3-splendor-audio-assets/audio/`.

## 3. Code Update
- In `src/store/audioStore.ts`, change all `/assets/audio/...` URLs to `https://storage.googleapis.com/bg3-splendor-audio-assets/audio/...`.

## 4. Verification
- `test_audio.mjs` will assert that the URLs inside `window.__ZUSTAND_AUDIO_STORE__.getState().bgmPlaylist` include `storage.googleapis.com`.
- Deploy to Cloud Run to finalize the changes and offload the container's Nginx server from serving heavy media files.