import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage();

  await page.goto('http://localhost:4173');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await page.waitForTimeout(1000);
  await page.click('button:has-text("Play as Gale")');
  await page.waitForTimeout(1000);

  // Inject game state
  await page.evaluate(() => {
     const store = window.__ZUSTAND_STORE__;
     const state = store.getState();
     const newPlayers = [...state.players];
     
     // Give Player 0 (Gale): 3 Radiant Gem tokens, and 2 acquired cards that give Radiant Gem bonus
     newPlayers[0].resources = {
         ...newPlayers[0].resources,
         "radiant_gem": 3
     };
     
     // Mock two cards providing RADIANT_GEM bonus
     newPlayers[0].acquiredCards = [
         { id: 'mock1', bonus: 'radiant_gem', tier: 1, cost: {}, points: 0, assetId: 'mock1', name: 'Mock Card 1' },
         { id: 'mock2', bonus: 'radiant_gem', tier: 1, cost: {}, points: 0, assetId: 'mock2', name: 'Mock Card 2' }
     ];
     
     // Calculate bonuses correctly (required for frontend rendering if we pass it, but PlayerBoard uses props derived from state)
     newPlayers[0].bonuses = {
         "radiant_gem": 2
     };

     store.setState({ players: newPlayers });
  });

  await page.waitForTimeout(1000);

  // Look for the total power element
  const totalPowerStr = await page.evaluate(() => {
      // Find the element with data-testid="total-power-RADIANT_GEM" inside Gale's board
      const board = document.querySelector('#player-board-Gale');
      if (!board) return 'Board not found';
      
      const powerEl = board.querySelector('[data-testid="total-power-RADIANT_GEM"]');
      return powerEl ? powerEl.textContent : 'Power element not found';
  });

  console.log(`Measured Radiant Gem Total Power: ${totalPowerStr}`);

  if (totalPowerStr !== '5') {
      console.log(`🔴 SYSTEM FAULT: Expected Total Power 5, but got ${totalPowerStr}`);
      process.exit(1);
  }

  console.log('🟢 PROBE SUCCESS: Player Board RPG stack displays correct total power.');
  await browser.close();
  process.exit(0);
})();