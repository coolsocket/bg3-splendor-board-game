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

  const nameClasses = await page.evaluate(() => {
      const board = document.querySelector('#player-board-Gale');
      if (!board) return '';
      const nameElements = Array.from(board.querySelectorAll('div.text-lg.font-bold'));
      const nameEl = nameElements.find(el => el.textContent.includes('Gale'));
      return nameEl ? nameEl.className : '';
  });

  console.log(`Classes: ${nameClasses}`);

  if (nameClasses.includes('bg-black')) {
      console.log('🔴 SYSTEM FAULT: The background box class (bg-black/...) is still present.');
      process.exit(1);
  }
  
  if (nameClasses.includes('border-[#bf953f]')) {
      console.log('🔴 SYSTEM FAULT: The border class is still present.');
      process.exit(1);
  }

  console.log('🟢 PROBE SUCCESS: The player name UI is clean and natural.');
  await browser.close();
  process.exit(0);
})();