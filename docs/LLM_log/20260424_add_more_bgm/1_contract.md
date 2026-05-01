# Contract: Add More BG3 BGM Tracks

## Context (Entry)
The game currently has 3 BGM tracks rotating in the playlist. The user wants to expand the playlist by adding 3 more iconic Baldur's Gate 3 tracks to enhance the immersive experience.

## Definition of Done (Exit)
1. **Automated Probe (`3_probes/test_more_bgm.mjs`)**: A script that verifies the audio store state in the browser.
2. **Implementation**: 
    - Download 3 additional tracks (e.g., "I Want To Live", "Nightsong", "Gather Your Allies") via `yt-dlp`.
    - Update `src/store/audioStore.ts` to include these 3 new tracks in `BGM_PLAYLIST`.
3. **Assertion**: The probe must evaluate `window.__ZUSTAND_AUDIO_STORE__.getState().bgmPlaylist` and ensure its length is at least 6. The probe exits with 0 on success.