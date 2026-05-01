import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`));
    page.on('pageerror', err => console.log(`[PAGE ERROR] ${err.message}`));

    console.log('Navigating...');
    await page.goto('https://bg3-splendor-4vh3ik46wa-uc.a.run.app/', { waitUntil: 'networkidle' });
    
    await page.waitForTimeout(2000);
    await page.click('button:has-text("Play as Gale")');
    await page.waitForTimeout(2000);
    
    await browser.close();
})();
