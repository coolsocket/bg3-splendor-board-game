import { chromium } from 'playwright';

(async () => {
  console.log('🚀 Launching headless browser (Player UI Probe)...');
  const browser = await chromium.launch({ 
    args: ['--autoplay-policy=no-user-gesture-required'] 
  });
  const page = await browser.newPage();

  page.on('pageerror', err => console.log(`[PAGE ERROR] ${err.message}`));

  console.log('🌐 Navigating to BG3 Splendor Arena...');
  await page.goto('http://localhost:4173');

  console.log('🧹 Resetting and injecting massive resources to make cards affordable...');
  await page.evaluate(() => {
      localStorage.clear();
      const store = window.__ZUSTAND_STORE__;
      const state = store.getState();
      const newPlayers = [...state.players];
      // Give Gale money
      newPlayers[0] = {
          ...newPlayers[0],
          resources: {
              "radiant_gem": 10,
              "arcane_crystal": 10,
              "natures_blessing": 10,
              "infernal_iron": 10,
              "dark_quartz": 10,
              "true_soul_tadpole": 10
          }
      };
      // Give Astarion money too
      newPlayers[1] = {
          ...newPlayers[1],
          resources: {
              "radiant_gem": 10,
              "arcane_crystal": 10,
              "natures_blessing": 10,
              "infernal_iron": 10,
              "dark_quartz": 10,
              "true_soul_tadpole": 10
          }
      };
      // Set the active player to Astarion (index 1)
      store.getState().setGameState({ players: newPlayers, currentPlayerIndex: 1 });
  });

  await page.reload();
  await page.waitForSelector('button:has-text("Play as Gale")');
  console.log('👤 Authenticating as Gale...');
  await page.click('button:has-text("Play as Gale")');
  await page.waitForTimeout(1000);

  console.log('🔍 Inspecting the glow scope...');
  // It is Astarion's turn. Gale should NOT see the intense glow, even though the active player (Astarion) can afford them.
  // We check if the enhanced glow classes are present.
  const hasEnhancedGlow = await page.evaluate(() => {
      const overlays = Array.from(document.querySelectorAll('.animate-pulse.pointer-events-none'));
      return overlays.some(el => el.className.includes('ring-[#ffd700]') || el.className.includes('mix-blend-screen'));
  });

  if (hasEnhancedGlow) {
      console.log('🔴 SYSTEM FAULT: Glowing cards visible to Gale during Astarion\'s turn!');
      process.exit(1);
  } else {
      console.log('✅ Glow correctly suppressed out-of-turn.');
  }

  console.log('🔍 Inspecting Player Board YOU badge and contrast...');
  const playerBoardHtml = await page.evaluate(() => {
      const el = document.querySelector('#player-board-Gale');
      return el ? el.outerHTML : '';
  });

  if (!playerBoardHtml.includes('You') && !playerBoardHtml.includes('YOU')) {
      console.log('🔴 SYSTEM FAULT: Gale\'s player board is missing the "YOU" badge!');
      process.exit(1);
  } else {
      console.log('✅ "YOU" badge found on the local player\'s board.');
  }

  if (!playerBoardHtml.includes('drop-shadow') && !playerBoardHtml.includes('bg-black')) {
      console.log('🔴 SYSTEM FAULT: Player name seems to lack explicit contrast classes (no drop-shadow or bg-black)!');
      process.exit(1);
  } else {
      console.log('✅ High-contrast text classes found on player name.');
  }

  console.log('🟢 PROBE SUCCESS: All UI and glow scope tests passed.');
  process.exit(0);
})();