import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage();

  await page.goto('http://localhost:4173');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await page.waitForTimeout(1000);
  await page.click('button:has-text("Play as Gale")');
  await page.waitForTimeout(1500);

  const testResults = await page.evaluate(() => {
     // Check if .card-name exists inside standard cards (div[id^="card-"])
     const cardNameDivs = Array.from(document.querySelectorAll('div[id^="card-"] .card-name'));
     
     return {
         standardCardsHaveNames: cardNameDivs.length > 0
     };
  });

  console.log(`Probe Results:`, testResults);

  if (testResults.standardCardsHaveNames) {
      console.log('🔴 SYSTEM FAULT: Standard cards still have visible name elements (.card-name).');
      process.exit(1);
  }

  console.log('🟢 PROBE SUCCESS: Standard cards no longer display names.');
  await browser.close();
  process.exit(0);
})();