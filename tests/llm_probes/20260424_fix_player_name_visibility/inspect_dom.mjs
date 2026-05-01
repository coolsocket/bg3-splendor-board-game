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
      const nameEl = document.querySelector('#player-board-Gale h2');
      if (!nameEl) return { error: 'Element not found' };

      const rect = nameEl.getBoundingClientRect();
      const computed = window.getComputedStyle(nameEl);

      const parentEl = nameEl.parentElement;
      const parentRect = parentEl.getBoundingClientRect();
      const parentComputed = window.getComputedStyle(parentEl);

      return {
          nameOuterHTML: nameEl.outerHTML,
          parentOuterHTML: parentEl.outerHTML,
          rect: { width: rect.width, height: rect.height, x: rect.x, y: rect.y },
          parentRect: { width: parentRect.width, height: parentRect.height },
          styles: {
              color: computed.color,
              display: computed.display,
              visibility: computed.visibility,
              opacity: computed.opacity,
              fontSize: computed.fontSize,
              overflow: computed.overflow,
              flexBasis: computed.flexBasis,
              flexShrink: computed.flexShrink,
              whiteSpace: computed.whiteSpace,
              zIndex: computed.zIndex
          },
          parentStyles: {
              display: parentComputed.display,
              flexDirection: parentComputed.flexDirection,
              width: parentComputed.width,
              overflow: parentComputed.overflow
          }
      };
  });

  console.log(JSON.stringify(info, null, 2));

  await browser.close();
})();