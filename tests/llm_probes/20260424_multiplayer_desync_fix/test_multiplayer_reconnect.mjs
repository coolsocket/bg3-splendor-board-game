import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  console.log('--- PROBE: RECONNECT & FOCUS CATCH-UP ---');

  const pageA = await browser.newPage();
  await pageA.goto('http://localhost:4173');
  await pageA.evaluate(() => localStorage.clear());
  await pageA.reload();
  await pageA.click('button:has-text("Play as Gale")');
  await pageA.waitForTimeout(1500);

  // Gale makes an action
  await pageA.evaluate(() => {
    const tokens = document.querySelectorAll('.public-resource-pool .cursor-pointer');
    if (tokens.length >= 3) {
      tokens[0].click();
      tokens[1].click();
      tokens[2].click();
    }
  });
  await pageA.waitForTimeout(500);
  await pageA.click('[data-testid^="btn-确认"], [data-testid^="btn-confirm"]');
  console.log('Gale took tokens. Waiting for animation...');
  await pageA.waitForTimeout(3000);

  // Now open Astarion (Simulating a fresh join or refresh)
  console.log('Astarion joining later...');
  const pageB = await browser.newPage();
  await pageB.goto('http://localhost:4173');
  await pageB.evaluate(() => localStorage.clear());
  await pageB.reload();
  await pageB.click('button:has-text("Play as Astarion")');
  
  // The crucial part: On joining, it should automatically request the state from Gale
  await pageB.waitForTimeout(2000);

  const turnIndexB = await pageB.evaluate(() => window.__ZUSTAND_STORE__.getState().currentPlayerIndex);
  console.log(`Astarion sees Turn Index: ${turnIndexB} (Expect 1)`);

  if (turnIndexB === 1) {
      console.log('🟢 PROBE SUCCESS: Late joiner caught up correctly.');
      await browser.close();
      process.exit(0);
  } else {
      console.log('🔴 SYSTEM FAULT: Late joiner is out of sync.');
      await browser.close();
      process.exit(1);
  }
})();