# Contract: Implement BGM Playlist

## Context (Entry)
The game currently only has one background music track (`bgm_main.mp3`). The user wants to add multiple popular tracks from Baldur's Gate 3 and have them play in a rotation (playlist) rather than looping a single track continuously.

## Definition of Done (Exit)
1. **Automated Probe (`3_probes/test_bgm_playlist.mjs`)**: A script that intercepts Howler.js initialization or Zustand state to verify that the BGM system is now initialized with an array of audio files (playlist) rather than a single static file, and that a mechanism exists to play the next track.
2. **Implementation**: 
    - Download at least 2 additional popular BG3 tracks using `yt-dlp` and `ffmpeg` (e.g., "Down by the River", "Raphael's Final Act", etc.).
    - Modify `src/store/audioStore.ts` to manage a playlist of tracks, playing the next one when the `on('end')` event triggers on the current track.
3. **Assertion**: The probe must verify the `playlist` state in `audioStore` and ensure that it contains multiple tracks. The probe exits with 0 on success.