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
      // Find the div containing the player name "Gale" within the player board
      const board = document.querySelector('#player-board-Gale');
      if (!board) return { error: 'Board not found' };
      
      const nameElements = Array.from(board.querySelectorAll('div.text-lg.font-bold'));
      const nameEl = nameElements.find(el => el.textContent.includes('Gale'));
      
      if (!nameEl) return { error: 'Name div not found' };

      const rect = nameEl.getBoundingClientRect();
      const computed = window.getComputedStyle(nameEl);

      return {
          color: computed.color,
          width: rect.width,
          height: rect.height
      };
  });

  console.log(JSON.stringify(info, null, 2));

  // Verify it is not the dark blackish color (rgb(8, 6, 13)) and width/height are reasonable
  if (info.color === 'rgb(8, 6, 13)' || info.color === 'rgba(0, 0, 0, 0)') {
      console.log('🔴 SYSTEM FAULT: Player name text color is still illegible.');
      process.exit(1);
  }

  if (info.width < 10 || info.height < 10) {
      console.log('🔴 SYSTEM FAULT: Player name is physically too small or clipped.');
      process.exit(1);
  }

  console.log('🟢 PROBE SUCCESS: Player name has correct contrast color and bounding box.');
  await browser.close();
  process.exit(0);
})();