import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    let moduleError = false;

    page.on('response', response => {
        if (response.url().includes('[object%20Module]')) {
            console.log(`[MODULE ERROR] App requested [object Module] instead of a valid URL: ${response.url()}`);
            moduleError = true;
        }
    });

    console.log('Navigating to https://bg3-splendor-4vh3ik46wa-uc.a.run.app/ ...');
    await page.goto('https://bg3-splendor-4vh3ik46wa-uc.a.run.app/', { waitUntil: 'networkidle' });
    
    await page.waitForTimeout(2000);
    await page.click('button:has-text("Play as Gale")');
    await page.waitForTimeout(5000); // Give time for images and audio to load

    if (moduleError) {
        console.log('🔴 SYSTEM FAULT: The [object Module] bug is still present!');
        process.exit(1);
    }
    
    // Verify BGM loaded successfully
    const bgmLoaded = await page.evaluate(() => {
        const store = window.__ZUSTAND_AUDIO_STORE__;
        if (!store) return false;
        const howl = store.getState()._getBgmHowl();
        if (!howl) return false;
        return howl.state() === 'loaded';
    });

    if (!bgmLoaded) {
         console.log('🔴 SYSTEM FAULT: The BGM track failed to load via Howler.js.');
         process.exit(1);
    }

    console.log('🟢 PROBE SUCCESS: Cards loaded correctly and BGM track successfully buffered.');
    await browser.close();
    process.exit(0);
})();