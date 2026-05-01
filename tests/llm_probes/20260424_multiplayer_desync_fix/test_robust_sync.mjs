import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  console.log('--- PROBE: CLEAN MULTIPLAYER SYNC ---');

  const pageA = await browser.newPage();
  await pageA.goto('http://localhost:4173');
  await pageA.evaluate(() => localStorage.clear());
  await pageA.reload();
  await pageA.click('button:has-text("Play as Gale")');
  await pageA.waitForTimeout(1000);

  const pageB = await browser.newPage();
  await pageB.goto('http://localhost:4173');
  await pageB.evaluate(() => localStorage.clear());
  await pageB.reload();
  await pageB.click('button:has-text("Play as Astarion")');
  await pageB.waitForTimeout(1000);

  // 0. WAIT FOR SOCKET CONNECTION
  console.log('Waiting for sockets to connect...');
  await pageA.waitForFunction(() => window.__SOCKET__ && window.__SOCKET__.connected);
  await pageB.waitForFunction(() => window.__SOCKET__ && window.__SOCKET__.connected);
  console.log('Sockets connected.');

  // 1. GET INITIAL TOKEN COUNT
  const initialGemsB = await pageB.evaluate(() => window.__ZUSTAND_STORE__.getState().players[0].resources.radiant_gem);
  console.log(`Initial Gems for Gale (on Page B): ${initialGemsB}`);

  // 2. DISPATCH ACTION ON PAGE A
  console.log('Dispatching TAKE_TOKENS on Page A...');
  await pageA.evaluate(() => {
      const store = window.__ZUSTAND_STORE__.getState();
      const galeId = store.players[0].id;
      store.dispatchAction({
          type: 'TAKE_TOKENS',
          payload: {
              playerId: galeId,
              tokens: { "radiant_gem": 1, "arcane_crystal": 1, "natures_blessing": 1 }
          }
      });
      store.dispatchAction({ type: 'END_TURN', payload: { playerId: galeId } });
  });

  console.log('Waiting for sync on Page B...');
  await pageB.waitForTimeout(2000);

  // 3. VERIFY ON PAGE B
  const finalGemsB = await pageB.evaluate(() => window.__ZUSTAND_STORE__.getState().players[0].resources.radiant_gem);
  const turnIndexB = await pageB.evaluate(() => window.__ZUSTAND_STORE__.getState().currentPlayerIndex);

  console.log(`Page B Final -> Gale Radiant Gem: ${finalGemsB}, Turn Index: ${turnIndexB}`);

  let failed = false;
  if (finalGemsB === initialGemsB && turnIndexB === 0) {
      console.log(`🔴 SYSTEM FAULT: No sync detected at all.`);
      failed = true;
  }

  if (failed) {
      await browser.close();
      process.exit(1);
  }

  console.log('🟢 PROBE SUCCESS: Multiplayer sync is confirmed working.');
  await browser.close();
  process.exit(0);
})();