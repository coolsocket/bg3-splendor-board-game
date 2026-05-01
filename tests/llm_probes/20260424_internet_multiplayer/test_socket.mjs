import { chromium } from 'playwright';

(async () => {
  console.log('🚀 Launching two headless browsers for multiplayer test...');
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  
  // Player 1 Context
  const context1 = await browser.newContext();
  const page1 = await context1.newPage();
  
  // Player 2 Context
  const context2 = await browser.newContext();
  const page2 = await context2.newPage();

  const ROOM_URL = 'http://localhost:4173/?room=llm_test_room';

  console.log('🌐 Player 1 joining room...');
  await page1.goto(ROOM_URL);
  await page1.evaluate(() => localStorage.clear());
  await page1.reload();
  await page1.waitForSelector('button:has-text("Play as Gale")');
  await page1.click('button:has-text("Play as Gale")');
  await page1.waitForTimeout(1000);

  console.log('🌐 Player 2 joining room...');
  await page2.goto(ROOM_URL);
  await page2.evaluate(() => localStorage.clear());
  await page2.reload();
  await page2.waitForSelector('button:has-text("Play as Astarion")');
  await page2.click('button:has-text("Play as Astarion")');
  await page2.waitForTimeout(1000);

  console.log('💎 Player 1 clicks a token...');
  // Find player 1's local store state before clicking
  const p1StateBefore = await page1.evaluate(() => window.__ZUSTAND_STORE__.getState().players[0].resources.radiant_gem);
  
  await page1.click('.public-resource-pool [data-testid="token-RADIANT_GEM"]');
  await page1.waitForTimeout(100);
  await page1.click('.public-resource-pool [data-testid="token-ARCANE_CRYSTAL"]');
  await page1.waitForTimeout(100);
  await page1.click('.public-resource-pool [data-testid="token-NATURES_BLESSING"]');
  await page1.waitForTimeout(100);
  
  // Click the confirm button
  await page1.click('.staged-tokens + div > button:first-child');
  await page1.waitForTimeout(1500); // wait for socket to sync

  const p1StateAfter = await page1.evaluate(() => window.__ZUSTAND_STORE__.getState().players[0].resources.radiant_gem);

  // Verify Player 2's store has updated
  const p2SeenState = await page2.evaluate(() => window.__ZUSTAND_STORE__.getState().players[0].resources.radiant_gem);

  if (p1StateAfter === p1StateBefore) {
      console.log(`🔴 SYSTEM FAULT: Player 1 did not even get the token. P1 before: ${p1StateBefore}, P1 after: ${p1StateAfter}`);
      await browser.close();
      process.exit(1);
  }

  if (p2SeenState === p1StateBefore) {
      console.log(`🔴 SYSTEM FAULT: Player 2 did not receive the state sync! P1 after: ${p1StateAfter}, P2 sees: ${p2SeenState}`);
      await browser.close();
      process.exit(1);
  } else {
      console.log(`🟢 PROBE SUCCESS: Socket.io sync verified! P1 state correctly updated in P2's browser (seen: ${p2SeenState}).`);
      await browser.close();
      process.exit(0);
  }
})();