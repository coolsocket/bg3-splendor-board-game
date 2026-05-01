import { chromium } from 'playwright';

(async () => {
  console.log('🚀 Launching headless browser to test market layout size...');
  // Launch with a large viewport to give the market room to expand
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  await page.goto('http://localhost:4173');
  await page.waitForTimeout(1000);
  await page.click('button:has-text("Play as Gale")');
  await page.waitForTimeout(1000);

  const marketWidth = await page.evaluate(() => {
     // Find the CardMarket container. It's the div with role="heading" parent.
     const heading = document.querySelector('div[role="heading"]');
     if (!heading) return 0;
     const container = heading.parentElement.parentElement;
     if (!container) return 0;
     
     return container.getBoundingClientRect().width;
  });

  console.log(`Measured CardMarket Width: ${marketWidth}px`);

  // Originally it was capped at 820px. We want it to be > 850px on a 1920px screen.
  if (marketWidth <= 850) {
      console.log('🔴 SYSTEM FAULT: Card Market is still constrained (width <= 850px).');
      process.exit(1);
  }

  console.log('🟢 PROBE SUCCESS: Card Market successfully expanded to fill the middle area.');
  await browser.close();
  process.exit(0);
})();