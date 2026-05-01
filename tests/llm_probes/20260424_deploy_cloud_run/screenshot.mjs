import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://bg3-splendor-4vh3ik46wa-uc.a.run.app/');
    await page.waitForTimeout(3000);
    await page.click('button:has-text("Play as Gale")');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'tests/llm_probes/20260424_deploy_cloud_run/screenshot.png', fullPage: true });
    await browser.close();
})();
