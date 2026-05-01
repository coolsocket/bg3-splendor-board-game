import { chromium } from 'playwright';

(async () => {
  console.log('🚀 Launching headless browser (Out-of-Turn Probe)...');
  const browser = await chromium.launch({ 
    args: ['--autoplay-policy=no-user-gesture-required'] 
  });
  const page = await browser.newPage();

  console.log('🌐 Navigating to BG3 Splendor Arena...');
  await page.goto('http://localhost:4173');

  console.log('🧹 Resetting game state...');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await page.waitForSelector('button:has-text("Play as Gale")');
  console.log('👤 Authenticating as Gale...');
  await page.click('button:has-text("Play as Gale")');
  await page.waitForTimeout(1000);

  console.log('--- Turn 1 (Gale takes 3 tokens) ---');
  await page.click('.public-resource-pool [data-testid="token-RADIANT_GEM"]');
  await page.waitForTimeout(100);
  await page.click('.public-resource-pool [data-testid="token-ARCANE_CRYSTAL"]');
  await page.waitForTimeout(100);
  await page.click('.public-resource-pool [data-testid="token-NATURES_BLESSING"]');
  await page.waitForTimeout(100);
  
  await page.click('.staged-tokens + div > button:first-child');
  await page.waitForTimeout(1500); 

  console.log('--- Turn 2 (It is Astarion\'s turn) ---');
  // At this point, the UI says it is Astarion's turn, but Gale is the local player.
  
  // Try to interact with a Tier 1 card
  console.log('🃏 Gale attempts to click a Tier 1 card out of turn...');
  
  // The cards don't have distinct ids that are easy to target without state, 
  // but we can just click the first available Tier 1 card in the market.
  // The market cards are inside a container, let's grab the first Card.
  // Card elements have an onClick handler. Let's click the first one.
  const cards = page.locator('div[id^="card-"]');
  await cards.first().click();
  await page.waitForTimeout(500);

  // If the modal opens, we can see the close button '×'
  const closeButton = page.locator('button[aria-label="Close detail"]');
  if (await closeButton.isVisible()) {
      console.log('✅ Modal successfully opened for viewing.');

      // Now check if the action buttons are disabled
      // We look for the buttons in the action dock. They should be disabled.
      // There are two buttons: Acquire and Reserve
      const reserveButton = page.locator('button:has-text("Reserve")').or(page.locator('button:has-text("预留")')).first();
      const buyButton = page.locator('button:has-text("Acquire")').or(page.locator('button:has-text("招募")')).first();
      
      const isReserveDisabled = await reserveButton.isDisabled();
      const isBuyDisabled = await buyButton.isDisabled();

      if (isReserveDisabled && isBuyDisabled) {
          console.log('🟢 PROBE SUCCESS: Action buttons correctly disabled for out-of-turn player.');
          process.exit(0);
      } else {
          console.log('🔴 SYSTEM FAULT: Action buttons are STILL ENABLED out of turn!');
          process.exit(1);
      }
  } else {
      console.log('✅ Interaction correctly blocked at the board level. Modal did not open.');
      process.exit(0);
  }
  
  await browser.close();
})();