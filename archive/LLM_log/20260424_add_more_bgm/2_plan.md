# Plan: Add More BG3 BGM Tracks

## 1. Asset Acquisition
Use `yt-dlp` (with `ffmpeg` in `PATH`) to download 3 more BG3 tracks:
- "I Want To Live"
- "Nightsong"
- "Gather Your Allies"
Store them in `public/assets/audio/` as `.mp3`.

## 2. Code Modification
Update `src/store/audioStore.ts`:
```typescript
const BGM_PLAYLIST = [
  '/assets/audio/bgm_main.mp3',
  '/assets/audio/bgm_down_by_the_river.mp3',
  '/assets/audio/bgm_raphael.mp3',
  '/assets/audio/bgm_i_want_to_live.mp3',
  '/assets/audio/bgm_nightsong.mp3',
  '/assets/audio/bgm_gather_your_allies.mp3'
];
```

## 3. Verification
Run `3_probes/test_more_bgm.mjs` to ensure the audio store exposes the updated playlist length correctly.