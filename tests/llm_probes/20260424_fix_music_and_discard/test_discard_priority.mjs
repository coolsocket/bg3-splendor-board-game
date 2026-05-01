import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
    const page = await browser.newPage();
    
    console.log('Navigating to http://localhost:4173/?room=test_discard ...');
    await page.goto('http://localhost:4173/?room=test_discard');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Play as Gale")');
    await page.waitForTimeout(1000);

    // Give Gale massive resources so cards are affordable
    await page.evaluate(() => {
        const store = window.__ZUSTAND_STORE__;
        const state = store.getState();
        const newPlayers = [...state.players];
        newPlayers[0] = {
            ...newPlayers[0],
            resources: {
                "radiant_gem": 10,
                "arcane_crystal": 10,
                "natures_blessing": 10,
                "infernal_iron": 10,
                "dark_quartz": 10,
                "true_soul_tadpole": 10
            }
        };
        // Also force discardRequired to 1
        store.setState({ players: newPlayers, discardRequired: 1 });
    });

    await page.waitForTimeout(1000);

    const cards = page.locator('div[id^="card-"]');
    await cards.first().click();
    await page.waitForTimeout(500);

    // Now try to click a card's "Acquire" button. Since discardRequired=1, it should be disabled.
    const acquireButton = page.locator('button:has-text("Acquire")').or(page.locator('button:has-text("招募")')).first();
    const isDisabled = await acquireButton.isDisabled();

    if (!isDisabled) {
        console.log('🔴 SYSTEM FAULT: Action button is NOT disabled when discard is required!');
        process.exit(1);
    }

    console.log('🟢 PROBE SUCCESS: Discard priority blocks card interactions.');
    await browser.close();
    process.exit(0);
})();