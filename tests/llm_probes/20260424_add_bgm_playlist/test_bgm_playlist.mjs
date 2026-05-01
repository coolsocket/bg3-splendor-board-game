import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage();

  // Inject a small script to grab the audio store state
  await page.goto('http://localhost:4173');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await page.waitForSelector('button:has-text("Play as Gale")');
  await page.click('button:has-text("Play as Gale")');
  await page.waitForTimeout(1000);

  const audioState = await page.evaluate(() => {
     // Expose audio store to window in the code, or just check global BGM_PLAYLIST if it's exported.
     // Wait, the store isn't on window yet. We need to expose it in audioStore.ts
     // Assuming we expose window.__ZUSTAND_AUDIO_STORE__ = useAudioStore
     const store = window.__ZUSTAND_AUDIO_STORE__;
     if (!store) return null;
     
     const state = store.getState();
     return {
         currentBgmIndex: state.currentBgmIndex,
         playlistLength: state.bgmPlaylist ? state.bgmPlaylist.length : 0,
         bgmHowlPlaying: state._getBgmHowl ? state._getBgmHowl().playing() : false
     };
  });

  if (!audioState) {
      console.log('🔴 SYSTEM FAULT: audio store not found on window.');
      process.exit(1);
  }

  console.log('Audio State:', JSON.stringify(audioState, null, 2));

  if (audioState.playlistLength < 3) {
      console.log('🔴 SYSTEM FAULT: Playlist does not have at least 3 tracks.');
      process.exit(1);
  }

  if (typeof audioState.currentBgmIndex !== 'number') {
      console.log('🔴 SYSTEM FAULT: currentBgmIndex is missing.');
      process.exit(1);
  }

  console.log('🟢 PROBE SUCCESS: BGM Playlist configured correctly.');
  await browser.close();
  process.exit(0);
})();