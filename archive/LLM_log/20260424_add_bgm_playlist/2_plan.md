# Plan: Implement BGM Playlist

## 1. Asset Acquisition
Use `yt-dlp` to download two iconic BG3 tracks:
- "Down by the River" (Main Theme)
- "Raphael's Final Act" (or "Nine Blades")
Transcode them to 128kbps MP3 using `ffmpeg` and store them in `public/assets/audio/`.

## 2. Refactor `audioStore.ts`
Currently, `audioStore.ts` instantiates a single `bgmHowl` with `bgm_main.mp3` on loop.
Changes:
- Define an array of BGM file paths: `const BGM_PLAYLIST = ['/assets/audio/bgm_main.mp3', '/assets/audio/bgm_down_by_the_river.mp3', '/assets/audio/bgm_nine_blades.mp3']`.
- Track the `currentBgmIndex` in the state.
- Create a `playNextBgm()` function that advances the index and instantiates a new `Howl`.
- Bind the `on('end')` event of the current `Howl` to call `playNextBgm()` automatically, thus creating a seamless rotation instead of a single looped track.
- Make sure `window.__ZUSTAND_AUDIO_STORE__` or similar is exposed so the Playwright test can verify the state. (Will inject into `window` for testability).

## 3. Playwright Verification
The probe `test_bgm_playlist.mjs` will load the app, execute `window.__ZUSTAND_AUDIO_STORE__.getState()`, and verify that `currentBgmIndex` exists and `BGM_PLAYLIST` length is >= 3.