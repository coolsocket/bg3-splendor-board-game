import { chromium } from 'playwright';

(async () => {
  console.log('🚀 Launching headless browser (1920x800) to test market scroll...');
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  // Wide but somewhat short height to force scaling to hit the vertical limit
  const context = await browser.newContext({ viewport: { width: 1920, height: 800 } });
  const page = await context.newPage();

  await page.goto('http://localhost:4173');
  await page.waitForTimeout(1000);
  await page.click('button:has-text("Play as Gale")');
  await page.waitForTimeout(1000);

  const scrollInfo = await page.evaluate(() => {
     const heading = document.querySelector('div[role="heading"]');
     if (!heading) return { error: 'Heading not found' };
     
     const marketContainer = heading.parentElement.parentElement;
     const scrollWrapper = marketContainer.parentElement;

     return {
         marketHeight: marketContainer.getBoundingClientRect().height,
         wrapperScrollHeight: scrollWrapper.scrollHeight,
         wrapperClientHeight: scrollWrapper.clientHeight,
         hasScrollbar: (scrollWrapper.scrollHeight - scrollWrapper.clientHeight) > 15
     };
  });

  console.log(`Market Height: ${scrollInfo.marketHeight}px`);
  console.log(`Wrapper ScrollHeight: ${scrollInfo.wrapperScrollHeight}px, ClientHeight: ${scrollInfo.wrapperClientHeight}px`);

  if (scrollInfo.hasScrollbar) {
      console.log('🔴 SYSTEM FAULT: Market is too large and caused a vertical scrollbar!');
      process.exit(1);
  }

  console.log('🟢 PROBE SUCCESS: Market fits perfectly within the viewport without scrolling.');
  await browser.close();
  process.exit(0);
})();