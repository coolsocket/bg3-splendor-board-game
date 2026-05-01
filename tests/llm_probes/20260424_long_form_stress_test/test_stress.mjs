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

  console.log('--- STARTING MULTI-GAME STRESS TEST ---');
  
  const pageA = await setupPlayer('Gale');
  const pageB = await setupPlayer('Astarion');

  const runGame = async (gameNum) => {
    console.log(`\n🎮 GAME #${gameNum} START`);
    
    // Play 6 turns (3 each)
    for (let turn = 1; turn <= 6; turn++) {
      const stateA = await pageA.evaluate(() => window.__ZUSTAND_STORE__.getState());
      const currentPlayerIndex = stateA.currentPlayerIndex;
      const activePage = currentPlayerIndex === 0 ? pageA : pageB;
      const playerName = currentPlayerIndex === 0 ? 'Gale' : 'Astarion';

      console.log(`[Turn ${turn}] ${playerName}'s turn (Seq: #${stateA.sequenceNumber})...`);

      // 1. SELECT TOKENS via manual dispatch to ensure validity
      await activePage.evaluate(() => {
          const store = window.__ZUSTAND_STORE__.getState();
          const p = store.players[store.currentPlayerIndex];
          // Take 1 Radiant Gem if available, else 1 Arcane, etc.
          // For simplicity in test, we just use dispatchAction directly to simulate the confirm
          store.dispatchAction({
              type: 'TAKE_TOKENS',
              payload: {
                  playerId: p.id,
                  tokens: { "radiant_gem": 1, "arcane_crystal": 1, "natures_blessing": 1 }
              }
          });
          // Transition turn after a delay (simulating user clicking confirm)
          setTimeout(() => {
              window.__ZUSTAND_STORE__.getState().dispatchAction({
                  type: 'END_TURN',
                  payload: { playerId: p.id }
              });
          }, 1000);
      });

      console.log(`[Turn ${turn}] Action dispatched. Waiting for network and sequence increment...`);
      await pageA.waitForTimeout(4000); 

      const newStateA = await pageA.evaluate(() => window.__ZUSTAND_STORE__.getState());
      const newStateB = await pageB.evaluate(() => window.__ZUSTAND_STORE__.getState());
      
      console.log(`[Turn ${turn}] RESULT -> Page A Turn=${newStateA.currentPlayerIndex} Seq=${newStateA.sequenceNumber} | Page B Turn=${newStateB.currentPlayerIndex} Seq=${newStateB.sequenceNumber}`);
      
      if (newStateA.currentPlayerIndex === currentPlayerIndex) {
          console.log(`🔴 FAILURE: Turn did not advance on Page A!`);
          throw new Error('Turn loop regression');
      }
      if (newStateA.currentPlayerIndex !== newStateB.currentPlayerIndex) {
          console.log(`🔴 FAILURE: Desync detected! Page B turn is ${newStateB.currentPlayerIndex}`);
          throw new Error('Multiplayer desync');
      }
      if (newStateA.sequenceNumber <= stateA.sequenceNumber) {
          console.log(`🔴 FAILURE: Sequence number did not increment!`);
          throw new Error('Sequence logic failure');
      }
      
      console.log(`[Turn ${turn}] ✅ Success.`);
    }
  };

  try {
    await runGame(1);
    await runGame(2);
    console.log('\n🟢 SUCCESS: Stress test passed.');
  } catch (err) {
    console.log(`\n❌ FAILED: ${err.message}`);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();