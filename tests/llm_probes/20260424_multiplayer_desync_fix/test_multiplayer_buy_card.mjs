import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  console.log('--- PROBE: MULTIPLAYER CARD PURCHASE ---');

  const pageA = await browser.newPage();
  await pageA.goto('http://localhost:4173');
  await pageA.evaluate(() => localStorage.clear());
  await pageA.reload();
  await pageA.click('button:has-text("Play as Gale")');
  await pageA.waitForTimeout(1500);

  const pageB = await browser.newPage();
  await pageB.goto('http://localhost:4173');
  await pageB.evaluate(() => localStorage.clear());
  await pageB.reload();
  await pageB.click('button:has-text("Play as Astarion")');
  await pageB.waitForTimeout(1500);

  // 1. Force a card purchaseable state for Gale
  await pageA.evaluate(() => {
    const store = window.__ZUSTAND_STORE__;
    const state = store.getState();
    const gale = state.players[0];
    
    // Give Gale infinite money for a specific card
    const firstTier1Card = state.faceUpCards[1][0];
    if (firstTier1Card) {
        gale.resources = { ...firstTier1Card.cost };
        store.setState({ players: [...state.players] });
        window.dispatchEvent(new CustomEvent('request-sync-broadcast'));
    }
  });

  await pageA.waitForTimeout(1000);
  
  // 2. Gale buys the card
  const targetCardId = await pageA.evaluate(() => window.__ZUSTAND_STORE__.getState().faceUpCards[1][0].id);
  console.log(`Gale buying card: ${targetCardId}`);
  
  await pageA.click(`#card-${targetCardId}`);
  await pageA.waitForTimeout(500);
  const buyBtn = pageA.locator('[data-testid^="btn-招募"], [data-testid^="btn-acquire"]');
  await buyBtn.click();

  console.log('Waiting for animations and sync...');
  await pageA.waitForTimeout(3000);
  await pageB.waitForTimeout(1000);

  // 3. Verify on Page B
  const bState = await pageB.evaluate(() => {
      const state = window.__ZUSTAND_STORE__.getState();
      const isCardInMarket = Object.values(state.faceUpCards).flat().some(c => c.id === 'targetCardId');
      const galeHasCard = state.players[0].acquiredCards.some(c => c.id === 'targetCardId');
      return { isCardInMarket, galeHasCard, turnIndex: state.currentPlayerIndex };
  }, { targetCardId });

  console.log(`Page B results: Card still in market? ${bState.isCardInMarket}, Gale has it? ${bState.galeHasCard}, Turn Index: ${bState.turnIndex}`);

  if (bState.isCardInMarket) {
      console.log('🔴 SYSTEM FAULT: Card was not removed from Page B market.');
      process.exit(1);
  }
  if (bState.turnIndex !== 1) {
      console.log('🔴 SYSTEM FAULT: Turn did not advance on Page B.');
      process.exit(1);
  }

  console.log('🟢 PROBE SUCCESS: Multiplayer card purchase synced perfectly.');
  await browser.close();
  process.exit(0);
})();