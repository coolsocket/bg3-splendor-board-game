import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage();

  await page.goto('http://localhost:4173');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await page.waitForSelector('button:has-text("Play as Gale")');
  await page.click('button:has-text("Play as Gale")');
  await page.waitForTimeout(1000);

  const audioState = await page.evaluate(() => {
     const store = window.__ZUSTAND_AUDIO_STORE__;
     if (!store) return null;
     
     const state = store.getState();
     return {
         playlist: state.bgmPlaylist || [],
     };
  });

  if (!audioState) {
      console.log('🔴 SYSTEM FAULT: audio store not found on window.');
      process.exit(1);
  }

  const usesGCS = audioState.playlist.every(url => url.includes('storage.googleapis.com'));

  if (!usesGCS) {
      console.log('🔴 SYSTEM FAULT: Audio URLs are still using local paths.');
      console.log(audioState.playlist);
      process.exit(1);
  }

  console.log('🟢 PROBE SUCCESS: Audio URLs are correctly pointing to GCS.');
  await browser.close();
  process.exit(0);
})();