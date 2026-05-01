import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage();

  await page.goto('http://localhost:4173');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await page.waitForTimeout(1000);
  await page.click('button:has-text("Play as Gale")');
  await page.waitForTimeout(1500);

  // Inject a mock card and token
  await page.evaluate(() => {
     const store = window.__ZUSTAND_STORE__;
     const state = store.getState();
     const newPlayers = [...state.players];
     
     newPlayers[0].resources = {
         ...newPlayers[0].resources,
         "radiant_gem": 1
     };
     newPlayers[0].acquiredCards = [
         { id: 'mock1', bonus: 'radiant_gem', providedBonus: 'RADIANT_GEM', tier: 1, cost: {}, points: 0, assetId: 'adamantine_forge', name: 'Adamantine Forge' }
     ];
     store.setState({ players: newPlayers });
  });

  await page.waitForTimeout(1000);

  const testResults = await page.evaluate(() => {
     const board = document.querySelector('#player-board-Gale');
     if (!board) return { error: 'Board not found' };
     
     const tokenCountEl = board.querySelector('[data-testid="token-count-RADIANT_GEM"]');
     const cardCountEl = board.querySelector('[data-testid="card-count-RADIANT_GEM"]');
     
     const repo = window.__ASSET_REPOSITORY__;
     const jergalImg = repo ? repo.getArt('jergal_(withers)') : null;
     
     return {
         hasSeparatedTokenCount: !!tokenCountEl,
         hasSeparatedCardCount: !!cardCountEl,
         jergalAliasWorks: jergalImg && jergalImg.length > 0 && !jergalImg.includes('undefined')
     };
  });

  console.log(`Probe Results:`, testResults);

  let failed = false;
  if (!testResults.hasSeparatedTokenCount) {
      console.log('🔴 SYSTEM FAULT: Token count element is missing.');
      failed = true;
  }
  if (!testResults.hasSeparatedCardCount) {
      console.log('🔴 SYSTEM FAULT: Card count element is missing.');
      failed = true;
  }
  if (!testResults.jergalAliasWorks) {
      console.log('🔴 SYSTEM FAULT: Jergal asset alias is not returning a valid image.');
      failed = true;
  }

  if (failed) {
      process.exit(1);
  }

  console.log('🟢 PROBE SUCCESS: Counts are separated and Jergal alias works.');
  await browser.close();
  process.exit(0);
})();