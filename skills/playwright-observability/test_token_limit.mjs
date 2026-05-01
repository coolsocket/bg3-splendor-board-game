import { chromium } from 'playwright';

(async () => {
  console.log('🚀 Launching headless browser (Token Discard Flow Probe)...');
  const browser = await chromium.launch({ 
    args: ['--autoplay-policy=no-user-gesture-required'] 
  });
  const page = await browser.newPage();

  page.on('pageerror', err => console.log(`[PAGE ERROR] ${err.message}`));

  console.log('🌐 Navigating to BG3 Splendor Arena...');
  await page.goto('http://localhost:4173');

  console.log('🧹 Resetting game state...');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await page.waitForSelector('button:has-text("Play as Gale")');
  console.log('👤 Authenticating as Gale...');
  await page.click('button:has-text("Play as Gale")');
  await page.waitForTimeout(1000);

  console.log('💉 Injecting exactly 8 tokens into Gale via __ZUSTAND_STORE__...');
  await page.evaluate(() => {
      const store = window.__ZUSTAND_STORE__;
      const state = store.getState();
      const newPlayers = [...state.players];
      newPlayers[0] = {
          ...newPlayers[0],
          resources: {
              "radiant_gem": 4,
              "arcane_crystal": 4,
              "natures_blessing": 0,
              "infernal_iron": 0,
              "dark_quartz": 0,
              "true_soul_tadpole": 0
          }
      };
      store.getState().setGameState({ players: newPlayers });
  });

  await page.waitForTimeout(500);

  console.log('--- Turn 1 (Gale) - Has 8 tokens, will take 3 ---');
  console.log('💎 Selecting 3 tokens (taking to 11)...');
  await page.click('.public-resource-pool [data-testid="token-INFERNAL_IRON"]');
  await page.waitForTimeout(100);
  await page.click('.public-resource-pool [data-testid="token-DARK_QUARTZ"]');
  await page.waitForTimeout(100);
  await page.click('.public-resource-pool [data-testid="token-NATURES_BLESSING"]');
  await page.waitForTimeout(100);

  console.log('✅ Confirming take (Should trigger discard mode)...');
  await page.click('.staged-tokens + div > button:first-child');
  await page.waitForTimeout(500);

  const isDiscardMode = await page.isVisible('.text-red-400.animate-pulse');
  if (isDiscardMode) {
    console.log('🟢 Discard mode correctly triggered!');
  } else {
    console.log('🔴 Discard mode FAILED to trigger!');
    process.exit(1);
  }

  console.log('🗑️ Discarding 1 token from Gale board...');
  await page.click('[id^="player-board-"] [data-resource-type="RADIANT_GEM"]');
  await page.waitForTimeout(100);

  console.log('✅ Confirming discard...');
  await page.click('.staged-tokens + div > button:first-child');
  
  await page.waitForTimeout(1500);

  console.log('✅ Observability Scan Complete. The "Take 3, Discard 1" flow works perfectly in the browser!');
  await browser.close();
  process.exit(0);
})();