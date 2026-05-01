import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  
  const setupPlayer = async (name) => {
    const page = await browser.newPage();
    await page.goto('http://localhost:4173');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.click(`button:has-text("Play as ${name}")`);
    await page.waitForTimeout(1000);
    await page.waitForFunction(() => window.__SOCKET__ && window.__SOCKET__.connected);
    return page;
  };

  console.log('--- STARTING MASTER INTEGRATION PROBE ---');
  const pageA = await setupPlayer('Gale');
  const pageB = await setupPlayer('Astarion');

  try {
    // --- STAGE 1: TOKEN SYNC ---
    console.log('\n[Stage 1] Testing Token Take Sync...');
    await pageA.evaluate(() => {
        const store = window.__ZUSTAND_STORE__.getState();
        store.dispatchAction({
            type: 'TAKE_TOKENS',
            payload: { playerId: store.players[0].id, tokens: { "radiant_gem": 1, "arcane_crystal": 1, "natures_blessing": 1 } }
        });
        store.dispatchAction({ type: 'END_TURN', payload: { playerId: store.players[0].id } });
    });
    await pageA.waitForTimeout(4000);
    
    const turnB = await pageB.evaluate(() => window.__ZUSTAND_STORE__.getState().currentPlayerIndex);
    if (turnB !== 1) throw new Error(`Stage 1 Failed: Turn did not advance to Astarion on Page B (Turn: ${turnB})`);
    console.log('✅ Stage 1 Passed.');

    // --- STAGE 2: CARD PURCHASE SYNC ---
    console.log('\n[Stage 2] Testing Card Purchase Sync...');
    const targetCardId = await pageB.evaluate(() => {
        const store = window.__ZUSTAND_STORE__;
        const state = store.getState();
        const card = state.faceUpCards[1][0];
        // Give Astarion enough money
        const p = [...state.players];
        p[1].resources = { ...card.cost };
        store.setState({ players: p });
        // Force broadcast the money update
        window.dispatchEvent(new CustomEvent('request-sync-broadcast'));
        return card.id;
    });
    
    await pageB.waitForTimeout(1000);
    console.log(`Astarion buying card ${targetCardId}...`);
    await pageB.click(`#card-${targetCardId}`);
    await pageB.waitForTimeout(500);
    await pageB.click('[data-testid^="btn-招募"], [data-testid^="btn-acquire"]');
    
    await pageB.waitForTimeout(4000);
    const hasCardA = await pageA.evaluate((id) => {
        return window.__ZUSTAND_STORE__.getState().players[1].acquiredCards.some(c => c.id === id);
    }, targetCardId);
    
    if (!hasCardA) throw new Error('Stage 2 Failed: Card purchase did not sync to Page A');
    console.log('✅ Stage 2 Passed.');

    // --- STAGE 3: PATRON VISIT SYNC ---
    console.log('\n[Stage 3] Testing Patron Visit Sync...');
    const patronId = await pageA.evaluate(() => {
        const store = window.__ZUSTAND_STORE__;
        const state = store.getState();
        const patron = state.availablePatrons[0];
        // Give Gale the bonuses needed for this patron
        const p = [...state.players];
        p[0].bonuses = { ...patron.cost }; 
        store.setState({ players: p });
        window.dispatchEvent(new CustomEvent('request-sync-broadcast'));
        return patron.id;
    });

    await pageA.waitForTimeout(1000);
    // Any action by Gale that ends turn should trigger patron visit check
    await pageA.evaluate(() => {
        const store = window.__ZUSTAND_STORE__.getState();
        store.dispatchAction({ type: 'TAKE_TOKENS', payload: { playerId: store.players[0].id, tokens: { "dark_quartz": 1 } } });
        store.dispatchAction({ type: 'END_TURN', payload: { playerId: store.players[0].id } });
    });

    await pageA.waitForTimeout(5000); // Patron animation is long
    const hasPatronB = await pageB.evaluate((id) => {
        return window.__ZUSTAND_STORE__.getState().players[0].patrons.some(p => p.id === id);
    }, patronId);

    if (!hasPatronB) throw new Error('Stage 3 Failed: Patron visit did not sync to Page B');
    console.log('✅ Stage 3 Passed.');

    // --- STAGE 4: WIN CONDITION SYNC ---
    console.log('\n[Stage 4] Testing Win Condition Sync...');
    await pageB.evaluate(() => {
        const store = window.__ZUSTAND_STORE__;
        const state = store.getState();
        const p = [...state.players];
        p[1].prestigePoints = 17; // Near winning
        store.setState({ players: p });
        window.dispatchEvent(new CustomEvent('request-sync-broadcast'));
    });
    
    await pageB.waitForTimeout(1000);
    // Astarion takes one more action to hit 18 (or we just force it)
    await pageB.evaluate(() => {
        const store = window.__ZUSTAND_STORE__;
        const state = store.getState();
        const p = [...state.players];
        p[1].prestigePoints = 18; 
        store.setState({ players: p, lastSyncTimestamp: Date.now() });
        window.dispatchEvent(new CustomEvent('request-sync-broadcast'));
    });

    await pageB.waitForTimeout(2000);
    const winVisibleA = await pageA.isVisible('text=ASCENSION');
    const winVisibleB = await pageB.isVisible('text=ASCENSION');
    
    console.log(`Victory Screen -> Page A: ${winVisibleA}, Page B: ${winVisibleB}`);
    if (!winVisibleA || !winVisibleB) throw new Error('Stage 4 Failed: Victory screen not synced');
    console.log('✅ Stage 4 Passed.');

    console.log('\n🌟 MASTER INTEGRATION SUCCESS: All systems verified.');
    process.exit(0);

  } catch (err) {
    console.log(`\n❌ MASTER PROBE FAILED: ${err.message}`);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();