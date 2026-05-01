import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  
  // Client A (Gale)
  const pageA = await browser.newPage();
  await pageA.goto('http://localhost:4173');
  await pageA.evaluate(() => localStorage.clear());
  await pageA.reload();
  await pageA.click('button:has-text("Play as Gale")');
  await pageA.waitForTimeout(1000);

  // Client B (Astarion)
  const pageB = await browser.newPage();
  await pageB.goto('http://localhost:4173');
  await pageB.evaluate(() => localStorage.clear());
  await pageB.reload();
  await pageB.click('button:has-text("Play as Astarion")');
  await pageB.waitForTimeout(1000);

  console.log('Setup complete. Modifying state in Client A...');

  // Wait for socket to connect
  await pageA.waitForTimeout(2000);
  await pageB.waitForTimeout(2000);

  // Modify state in Client A
  await pageA.evaluate(() => {
      const store = window.__ZUSTAND_STORE__;
      const state = store.getState();
      
      const newPlayers = [...state.players];
      newPlayers[0].prestigePoints = 99; 
      
      // We manually set isReceiving to true temporarily to PREVENT the subscribe() from emitting immediately,
      // forcing the HEARTBEAT to be the only way the state gets sent.
      window.__IS_RECEIVING_OVERRIDE__ = true;
      store.setState({ players: newPlayers, lastSyncTimestamp: Date.now() });
      setTimeout(() => { window.__IS_RECEIVING_OVERRIDE__ = false; }, 100);
  });

  console.log('State modified in Client A. Waiting 7 seconds for heartbeat sync...');
  await pageB.waitForTimeout(7000);

  const bPrestige = await pageB.evaluate(() => {
      const store = window.__ZUSTAND_STORE__;
      return store.getState().players[0].prestigePoints;
  });

  console.log(`Client B Gale prestige: ${bPrestige}`);

  if (bPrestige === 99) {
      console.log('🟢 PROBE SUCCESS: State converged via heartbeat.');
      await browser.close();
      process.exit(0);
  } else {
      console.log('🔴 SYSTEM FAULT: State did not converge. Heartbeat failed.');
      await browser.close();
      process.exit(1);
  }
})();