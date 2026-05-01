import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage();
  await page.goto('http://localhost:4173/?room=llm_test_room');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForSelector('button:has-text("Play as Gale")');
  await page.click('button:has-text("Play as Gale")');
  await page.waitForTimeout(1000);
  const p1State = await page.evaluate(() => window.__ZUSTAND_STORE__.getState().players[0]);
  console.log(JSON.stringify(p1State, null, 2));
  await browser.close();
})();
