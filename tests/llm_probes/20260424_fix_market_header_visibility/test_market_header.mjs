import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage();

  await page.goto('http://localhost:4173');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await page.waitForSelector('button:has-text("Play as Gale")');
  await page.click('button:has-text("Play as Gale")');
  await page.waitForTimeout(1000);

  const info = await page.evaluate(() => {
      // Find the card market header. It contains the text like "CARD MARKET" or "卡牌市场"
      // and has spans with bg-gradient inside it.
      const headers = Array.from(document.querySelectorAll('h2, div[role="heading"]'));
      const marketHeader = headers.find(el => el.textContent.includes('MARKET') || el.textContent.includes('卡牌市场') || el.textContent.includes('市场'));
      
      if (!marketHeader) return { error: 'Market header not found' };

      const computed = window.getComputedStyle(marketHeader);
      
      return {
          tagName: marketHeader.tagName,
          color: computed.color,
          text: marketHeader.textContent
      };
  });

  console.log(JSON.stringify(info, null, 2));

  if (info.error) {
      console.log('🔴 SYSTEM FAULT: Could not find the Card Market header element.');
      process.exit(1);
  }

  // Verify it is not the dark blackish color (rgb(8, 6, 13) or similar)
  if (info.color === 'rgb(8, 6, 13)' || info.color === 'rgba(0, 0, 0, 0)') {
      console.log('🔴 SYSTEM FAULT: Card Market header text color is overridden and illegible.');
      process.exit(1);
  }
  
  if (info.tagName.toLowerCase() === 'h2') {
      console.log('🔴 SYSTEM FAULT: Card Market header is still using an h2 tag, susceptible to global overrides.');
      process.exit(1);
  }

  console.log('🟢 PROBE SUCCESS: Card Market header has correct contrast color and tag.');
  await browser.close();
  process.exit(0);
})();