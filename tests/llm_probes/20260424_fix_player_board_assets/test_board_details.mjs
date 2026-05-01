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

  // Inject a mock card to test image rendering
  await page.evaluate(() => {
     const store = window.__ZUSTAND_STORE__;
     const state = store.getState();
     const newPlayers = [...state.players];
     
     newPlayers[0].acquiredCards = [
         { id: 'mock1', bonus: 'radiant_gem', providedBonus: 'RADIANT_GEM', tier: 1, cost: {}, points: 0, assetId: 'adamantine_forge', name: 'Adamantine Forge' }
     ];
     store.setState({ players: newPlayers });
  });

  await page.waitForTimeout(1000);

  const testResults = await page.evaluate(() => {
     const board = document.querySelector('#player-board-Gale');
     if (!board) return { error: 'Board not found' };
     
     const tadpolePower = board.querySelector('[data-testid="total-power-TRUE_SOUL_TADPOLE"]');
     const stackImage = board.querySelector('.card-stack-image');
     
     return {
         hasTadpoleColumn: !!tadpolePower,
         hasCardStackImage: !!stackImage
     };
  });

  console.log(`Probe Results:`, testResults);

  let failed = false;
  if (!testResults.hasTadpoleColumn) {
      console.log('🔴 SYSTEM FAULT: TRUE_SOUL_TADPOLE column is missing.');
      failed = true;
  }
  if (!testResults.hasCardStackImage) {
      console.log('🔴 SYSTEM FAULT: Card stack does not contain image elements (.card-stack-image).');
      failed = true;
  }

  if (failed) {
      process.exit(1);
  }

  console.log('🟢 PROBE SUCCESS: Tadpole column visible and card stacks show images.');
  await browser.close();
  process.exit(0);
})();