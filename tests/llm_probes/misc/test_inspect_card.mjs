import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER:', msg.text()));

  await page.goto('http://localhost:4173');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await page.waitForSelector('button:has-text("Play as Gale")');
  await page.click('button:has-text("Play as Gale")');
  await page.waitForTimeout(1000);

  // Click 3 tokens
  await page.click('.public-resource-pool [data-testid="token-RADIANT_GEM"]');
  await page.waitForTimeout(100);
  await page.click('.public-resource-pool [data-testid="token-ARCANE_CRYSTAL"]');
  await page.waitForTimeout(100);
  await page.click('.public-resource-pool [data-testid="token-NATURES_BLESSING"]');
  await page.waitForTimeout(100);
  
  await page.click('.staged-tokens + div > button:first-child');
  await page.waitForTimeout(2000);

  const activePlayer = await page.evaluate(() => {
     return window.__ZUSTAND_STORE__?.getState().players[window.__ZUSTAND_STORE__?.getState().currentPlayerIndex].name;
  });
  console.log('Active Player:', activePlayer);

  const cards = page.locator('div[id^="card-"]');
  await cards.first().click();
  await page.waitForTimeout(1000);

  const buttons = await page.evaluate(() => {
     return Array.from(document.querySelectorAll('button')).map(b => ({
         text: b.textContent,
         disabled: b.disabled,
         className: b.className
     }));
  });
  
  console.log('All Buttons:', buttons.filter(b => b.text.includes('Reserve') || b.text.includes('Acquire') || b.text.includes('预留') || b.text.includes('招募')));

  await browser.close();
})();
