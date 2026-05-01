import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    console.log('Navigating to https://bg3-splendor-4vh3ik46wa-uc.a.run.app/ ...');
    await page.goto('https://bg3-splendor-4vh3ik46wa-uc.a.run.app/', { waitUntil: 'networkidle' });
    
    await page.waitForTimeout(2000);
    await page.click('button:has-text("Play as Gale")');
    await page.waitForTimeout(3000); // Give time for images to load

    const cardImages = await page.evaluate(() => {
        const cards = document.querySelectorAll('div[id^="card-"] img');
        return Array.from(cards).map(img => img.src);
    });

    console.log(`Found ${cardImages.length} card images.`);
    cardImages.forEach((src, idx) => console.log(`Card ${idx}: ${src}`));

    if (cardImages.length === 0) {
        console.log('🔴 SYSTEM FAULT: No card images found in the market!');
        process.exit(1);
    }
    
    if (cardImages.some(src => !src || src.includes('[object%20Module]') || src.endsWith('undefined'))) {
        console.log('🔴 SYSTEM FAULT: Broken image src detected!');
        process.exit(1);
    }
    
    console.log('🟢 PROBE SUCCESS: Cards are successfully displayed.');
    await browser.close();
    process.exit(0);
})();