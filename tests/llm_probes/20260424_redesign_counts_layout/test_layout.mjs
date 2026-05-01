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
     
     const col = board.querySelector('[data-testid="resource-col-RADIANT_GEM"]');
     if (!col) return { error: 'Column not found' };

     // We expect the direct children of the column to be:
     // 1. Card count (metallic box)
     // 2. Token icon wrapper
     // 3. Token count (circle)
     // 4. Card stack

     const children = Array.from(col.children);
     
     // Find indexes of the specific test IDs
     const cardCountIdx = children.findIndex(c => c.getAttribute('data-testid') === 'card-count-RADIANT_GEM');
     const tokenIconIdx = children.findIndex(c => c.querySelector('img') || c.querySelector('svg') || c.classList.contains('w-8')); // The token wrapper usually has w-8
     const tokenCountIdx = children.findIndex(c => c.getAttribute('data-testid') === 'token-count-RADIANT_GEM');

     return {
         cardCountIdx,
         tokenIconIdx,
         tokenCountIdx,
         // Card count must be before token icon
         cardBeforeIcon: cardCountIdx !== -1 && tokenIconIdx !== -1 && cardCountIdx < tokenIconIdx,
         // Token count must be after token icon
         tokenAfterIcon: tokenCountIdx !== -1 && tokenIconIdx !== -1 && tokenCountIdx > tokenIconIdx
     };
  });

  console.log(`Probe Results:`, testResults);

  let failed = false;
  if (testResults.error) {
      console.log(`🔴 SYSTEM FAULT: ${testResults.error}`);
      failed = true;
  } else if (!testResults.cardBeforeIcon) {
      console.log('🔴 SYSTEM FAULT: Card count is not above the gem icon.');
      failed = true;
  } else if (!testResults.tokenAfterIcon) {
      console.log('🔴 SYSTEM FAULT: Token count is not below the gem icon.');
      failed = true;
  }

  if (failed) {
      process.exit(1);
  }

  console.log('🟢 PROBE SUCCESS: Counts are styled and ordered correctly (cards above, tokens below).');
  await browser.close();
  process.exit(0);
})();