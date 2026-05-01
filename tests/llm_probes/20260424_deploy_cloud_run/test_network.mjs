import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    page.on('response', response => {
        if (response.status() >= 400) {
            console.log(`Failed URL: ${response.url()} - Status: ${response.status()}`);
        }
    });

    console.log('Navigating...');
    await page.goto('https://bg3-splendor-4vh3ik46wa-uc.a.run.app/', { waitUntil: 'networkidle' });
    await browser.close();
})();
