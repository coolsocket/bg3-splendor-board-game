import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:4173');
  await page.waitForTimeout(2000);

  // SELECT CHARACTER FIRST
  await page.click('button:has-text("Play as Gale")');
  await page.waitForTimeout(2000);

  // Get current language from store
  const lang = await page.evaluate(() => window.__ZUSTAND_STORE__.getState().language);
  console.log(`Detected Language: ${lang}`);

  const expectedSyncText = lang === 'ZH' ? '远端联机' : 'Multiplayer Link';
  const expectedSubtitle = lang === 'ZH' ? '先攻获得' : 'Initiative Gained';

  // Check for localized Sync title
  const syncTitle = await page.innerText(`span:has-text("${expectedSyncText}")`);
  console.log(`Sync Title: ${syncTitle}`);

  // Trigger announcer
  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent('announce-turn', { 
        detail: { text: "Test", type: 'start' } 
    }));
  });
  await page.waitForTimeout(1000);
  
  const subtitle = await page.innerText('.tracking-\\[0\\.5em\\]');
  console.log(`Announcer Subtitle: ${subtitle}`);

  if (subtitle !== expectedSubtitle) {
      console.log(`🔴 FAILURE: Expected subtitle "${expectedSubtitle}", got "${subtitle}"`);
      process.exit(1);
  }

  console.log('🟢 SUCCESS: i18n verified.');
  await browser.close();
  process.exit(0);
})();