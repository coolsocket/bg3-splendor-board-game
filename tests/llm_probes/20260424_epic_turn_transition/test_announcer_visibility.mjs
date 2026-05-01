import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:4173');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  // Play as Gale to enter game
  await page.click('button:has-text("Play as Gale")');
  await page.waitForTimeout(1000);

  // Trigger the announcer event manually
  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent('announce-turn', { 
        detail: { text: "Testing Epic Transition", type: 'start' } 
    }));
  });

  await page.waitForTimeout(500);

  const testResults = await page.evaluate(() => {
     const announcer = document.querySelector('[data-testid="epic-announcer"]');
     if (!announcer) return { error: 'Announcer not found' };
     
     const backdrop = announcer.querySelector('.bg-black\\/60');
     const ribbons = announcer.querySelectorAll('.bg-gradient-to-r');
     
     return {
         isVisible: !!announcer,
         hasBackdrop: !!backdrop,
         hasRibbons: ribbons.length >= 2
     };
  });

  console.log(`Probe Results:`, testResults);

  let failed = false;
  if (testResults.error) {
      console.log(`🔴 SYSTEM FAULT: ${testResults.error}`);
      failed = true;
  } else if (!testResults.hasBackdrop || !testResults.hasRibbons) {
      console.log('🔴 SYSTEM FAULT: Announcer exists but lacks epic styling elements (backdrop or ribbons).');
      failed = true;
  }

  if (failed) {
      process.exit(1);
  }

  console.log('🟢 PROBE SUCCESS: Epic Announcer is live.');
  await browser.close();
  process.exit(0);
})();