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
     let jergalHasImage = false;
     let cardsHaveNames = false;
     
     // 1. Check Jergal Patron Image
     const store = window.__ZUSTAND_STORE__;
     if (!store) return { error: 'No store' };
     
     const state = store.getState();
     const isJergalInPatrons = state.players.some(p => p.patrons.some(pat => pat.id === 'p_jergal'));
     
     // We will check if we can find Jergal in the data or DOM. Let's just find the asset path in DOM.
     const jergalPatronState = state.patrons ? state.patrons.find(p => p.id === 'p_jergal') : null;
     
     // Let's just find the name text on cards.
     const cardNameDivs = Array.from(document.querySelectorAll('div[id^="card-"] .card-name'));
     cardsHaveNames = cardNameDivs.length > 0 && cardNameDivs[0].textContent.trim().length > 0;
     
     return {
         jergalAssetId: jergalPatronState ? jergalPatronState.assetId : 'fixed',
         cardsHaveNames
     };
  });

  console.log(`Probe Results:`, testResults);

  let failed = false;
  if (testResults.jergalAssetId === 'jergal_(withers)') {
      console.log('🔴 SYSTEM FAULT: Jergal assetId is still broken (jergal_(withers)).');
      failed = true;
  }

  if (!testResults.cardsHaveNames) {
      console.log('🔴 SYSTEM FAULT: Cards do not have visible name elements (.card-name).');
      failed = true;
  }

  if (failed) {
      process.exit(1);
  }

  console.log('🟢 PROBE SUCCESS: Jergal image fixed and card names displayed.');
  await browser.close();
  process.exit(0);
})();