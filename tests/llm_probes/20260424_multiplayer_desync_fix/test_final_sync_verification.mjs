import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  
  console.log('--- STARTING MULTIPLAYER SYNC PROBE ---');

  // 1. Setup Page A
  const pageA = await browser.newPage();
  await pageA.goto('http://localhost:4173');
  await pageA.evaluate(() => localStorage.clear());
  await pageA.reload();
  await pageA.click('button:has-text("Play as Gale")');
  await pageA.waitForTimeout(1500);

  // 2. Setup Page B
  const pageB = await browser.newPage();
  await pageB.goto('http://localhost:4173');
  await pageB.evaluate(() => localStorage.clear());
  await pageB.reload();
  await pageB.click('button:has-text("Play as Astarion")');
  await pageB.waitForTimeout(1500);

  // Verify Initial State
  const initialTurnA = await pageA.evaluate(() => window.__ZUSTAND_STORE__.getState().currentPlayerIndex);
  console.log(`Initial Turn (0 is Gale): ${initialTurnA}`);

  // 3. Action on Page A: Take 3 different tokens
  console.log('Player A (Gale) taking tokens...');
  // We need to click 3 different tokens and then confirm
  // Since the token pool is dynamic, we'll use evaluate to trigger the clicks accurately
  await pageA.evaluate(() => {
    const tokens = document.querySelectorAll('.public-resource-pool .cursor-pointer');
    if (tokens.length >= 3) {
      tokens[0].click();
      tokens[1].click();
      tokens[2].click();
    }
  });
  
  await pageA.waitForTimeout(500);
  // We use data-testid for more reliability
  const confirmBtn = pageA.locator('[data-testid^="btn-确认"], [data-testid^="btn-confirm"]');
  await confirmBtn.click();
  console.log('Action confirmed on Page A.');

  // 4. Verification Phase
  console.log('Waiting for turn transition and sync...');
  await pageA.waitForTimeout(3500); // 2.5s animation + buffer
  await pageB.waitForTimeout(1000); // extra buffer for socket

  const finalTurnA = await pageA.evaluate(() => window.__ZUSTAND_STORE__.getState().currentPlayerIndex);
  const finalTurnB = await pageB.evaluate(() => window.__ZUSTAND_STORE__.getState().currentPlayerIndex);
  
  const announcerVisibleA = await pageA.isVisible('[data-testid="epic-announcer"]');
  const announcerVisibleB = await pageB.isVisible('[data-testid="epic-announcer"]');

  console.log(`Final Turn Page A: ${finalTurnA} (Expect 1)`);
  console.log(`Final Turn Page B: ${finalTurnB} (Expect 1)`);
  
  let failed = false;
  if (finalTurnA !== 1) {
      console.log('🔴 SYSTEM FAULT: Page A did not transition to next turn.');
      failed = true;
  }
  if (finalTurnB !== 1) {
      console.log('🔴 SYSTEM FAULT: Page B did not sync the turn transition.');
      failed = true;
  }

  if (failed) {
      process.exit(1);
  }

  console.log('🟢 PROBE SUCCESS: Turn transition and multiplayer sync confirmed.');
  await browser.close();
  process.exit(0);
})();