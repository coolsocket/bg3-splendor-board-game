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

  console.log('--- PROBE: LOCK SYNCHRONIZATION TEST ---');
  const pageA = await setupPlayer('Gale');
  const pageB = await setupPlayer('Astarion');

  // 1. Trigger an action that causes a lock on Page A
  console.log('Gale taking action...');
  await pageA.evaluate(() => {
    const store = window.__ZUSTAND_STORE__.getState();
    const p = store.players[0];
    store.dispatchAction({
      type: 'TAKE_TOKENS',
      payload: { playerId: p.id, tokens: { "radiant_gem": 1, "arcane_crystal": 1, "natures_blessing": 1 } }
    });
    // Manually lock UI and trigger turn end
    window.__UI_STORE__.getState().setAnimationLocked(true);
    setTimeout(() => {
        window.__ZUSTAND_STORE__.getState().dispatchAction({ type: 'END_TURN', payload: { playerId: p.id } });
    }, 500);
  });

  // 2. Wait for transition
  console.log('Waiting for animation period (4s)...');
  await pageA.waitForTimeout(4000);

  // 3. CHECK LOCKS
  const lockA = await pageA.evaluate(() => window.__UI_STORE__.getState().isAnimationLocked);
  const lockB = await pageB.evaluate(() => window.__UI_STORE__.getState().isAnimationLocked);
  
  console.log(`Page A Lock: ${lockA}, Page B Lock: ${lockB}`);

  if (lockB === true) {
      console.log('🔴 BUG REPRODUCED: Page B is still locked after Page A finished transition.');
      process.exit(1);
  }

  console.log('🟢 PROBE SUCCESS: Locks are in sync (or at least independent enough).');
  await browser.close();
  process.exit(0);
})();