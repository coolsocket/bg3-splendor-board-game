import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage();

  await page.goto('http://localhost:4173');
  await page.waitForTimeout(1000);
  await page.click('button:has-text("Play as Gale")');
  await page.waitForTimeout(1000);

  const marketStyles = await page.evaluate(() => {
     const heading = document.querySelector('div[role="heading"]');
     if (!heading) return { error: 'Heading not found' };
     
     const marketContainer = heading.parentElement.parentElement;
     const middleColumnWrapper = marketContainer.parentElement.parentElement;

     return {
         marketClass: marketContainer.className,
         marketBg: window.getComputedStyle(marketContainer).backgroundColor,
         wrapperClass: middleColumnWrapper.className,
         wrapperStyle: middleColumnWrapper.getAttribute('style') || ''
     };
  });

  console.log('Market Container Classes:', marketStyles.marketClass);
  console.log('Middle Column Style:', marketStyles.wrapperStyle);

  let failed = false;

  if (marketStyles.marketClass.includes('bg-bg-obsidian') || marketStyles.marketClass.includes('border-gold-dark')) {
      console.log('🔴 SYSTEM FAULT: CardMarket still has the dark background/border box styling.');
      failed = true;
  }

  if (marketStyles.wrapperStyle.includes('radial-gradient')) {
      console.log('🔴 SYSTEM FAULT: GameArena middle column wrapper still has the radial-gradient box styling.');
      failed = true;
  }

  if (failed) {
      process.exit(1);
  }

  console.log('🟢 PROBE SUCCESS: Market boxes removed. Cards float naturally.');
  await browser.close();
  process.exit(0);
})();