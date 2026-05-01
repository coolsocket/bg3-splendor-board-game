import { chromium } from 'playwright';

(async () => {
  console.log('🚀 Launching headless browser (Affordable Glow Probe)...');
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
      store.getState().setGameState({ players: newPlayers });
  });

  await page.reload();
  await page.waitForSelector('button:has-text("Play as Gale")');
  console.log('👤 Authenticating as Gale...');
  await page.click('button:has-text("Play as Gale")');
  await page.waitForTimeout(1000);

  console.log('🔍 Inspecting the DOM for affordable cards...');
  // We want to find a card that is affordable (Gale has 10 of each, so all face-up cards should be affordable)
  // We check if the enhanced glow classes are present on the overlay element.
  
  // The overlay we will inject will have a specific identifiable class that proves the new design is active.
  // For instance, we will check for `ring-[#ffd700]` or a specific intense shadow class like `shadow-[0_0_30px_rgba(255,215,0,0.6)]`
  
  const hasEnhancedGlow = await page.evaluate(() => {
      const overlays = Array.from(document.querySelectorAll('.animate-pulse.pointer-events-none'));
      return overlays.some(el => 
          el.className.includes('ring-[#ffd700]') || 
          el.className.includes('shadow-[0_0_30px_rgba(212,175,55,0.8)]') ||
          el.className.includes('mix-blend-screen')
      );
  });

  if (hasEnhancedGlow) {
      console.log('🟢 PROBE SUCCESS: Enhanced affordable glow (ring/intense shadow/mix-blend) detected on affordable cards.');
      process.exit(0);
  } else {
      console.log('🔴 SYSTEM FAULT: Affordable cards are missing the enhanced glow classes!');
      process.exit(1);
  }
})();