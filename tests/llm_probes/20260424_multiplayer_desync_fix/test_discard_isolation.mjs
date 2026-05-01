import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  
  // Context 1: Gale
  const contextGale = await browser.newPage();
  await contextGale.goto('http://localhost:4173');
  await contextGale.evaluate(() => localStorage.clear());
  await contextGale.reload();
  await contextGale.click('button:has-text("Play as Gale")');
  await contextGale.waitForTimeout(1000);

  // Context 2: Astarion
  const contextAstarion = await browser.newPage();
  await contextAstarion.goto('http://localhost:4173');
  await contextAstarion.evaluate(() => localStorage.clear());
  await contextAstarion.reload();
  await contextAstarion.click('button:has-text("Play as Astarion")');
  await contextAstarion.waitForTimeout(1000);

  // TRIGGER DISCARD STATE FOR GALE ONLY
  await contextGale.evaluate(() => {
      const store = window.__ZUSTAND_STORE__;
      const state = store.getState();
      const gale = state.players.find(p => p.name === 'Gale');
      store.setState({ discardingInfo: { playerId: gale.id, amount: 2 } }); 
  });

  await contextGale.waitForTimeout(1000);
  await contextAstarion.waitForTimeout(1000);

  const galeSeesDiscard = await contextGale.isVisible('text=Confirm Discard');
  const astarionSeesDiscard = await contextAstarion.isVisible('text=Confirm Discard');

  console.log(`Gale sees discard UI: ${galeSeesDiscard}`);
  console.log(`Astarion sees discard UI: ${astarionSeesDiscard}`);

  let failed = false;
  if (!galeSeesDiscard) {
      console.log('🔴 SYSTEM FAULT: Gale should see discard UI.');
      failed = true;
  }
  
  // The BUG is that Astarion ALSO sees it.
  if (astarionSeesDiscard) {
      console.log('🔴 BUG REPRODUCED: Astarion also sees discard UI. (Desync/Isolation failure)');
      failed = true;
  }

  if (failed) {
      process.exit(1);
  }

  console.log('🟢 PROBE SUCCESS: Discard UI is correctly isolated.');
  await browser.close();
  process.exit(0);
})();