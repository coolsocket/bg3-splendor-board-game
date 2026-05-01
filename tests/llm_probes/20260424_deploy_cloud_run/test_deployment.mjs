import { execSync } from 'child_process';
import { chromium } from 'playwright';

(async () => {
    console.log('🚀 Starting Cloud Run Deployment Probe...');

    let url = '';
    try {
        console.log('🔍 Fetching Cloud Run service URL...');
        url = execSync('env -u http_proxy -u https_proxy -u all_proxy -u CLOUDSDK_CONTEXT_AWARE_USE_ECP_HTTP_PROXY gcloud run services describe bg3-splendor --project=my-website-417013 --region us-central1 --format "value(status.url)"', { stdio: 'pipe' }).toString().trim();
    } catch (e) {
        console.log('🔴 SYSTEM FAULT: Service bg3-splendor does not exist or gcloud failed.', e.message);
        process.exit(1);
    }

    if (!url) {
        console.log('🔴 SYSTEM FAULT: No URL returned from gcloud.');
        process.exit(1);
    }

    console.log(`🌐 Found deployed URL: ${url}`);

    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
        console.log(`⏳ Navigating to ${url}...`);
        const response = await page.goto(url, { waitUntil: 'networkidle' });
        
        if (response.status() !== 200) {
            console.log(`🔴 SYSTEM FAULT: URL returned HTTP ${response.status()} instead of 200.`);
            await browser.close();
            process.exit(1);
        }

        // Verify the app rendered by checking for a known element, like the login buttons
        const hasGaleButton = await page.locator('button:has-text("Play as Gale")').isVisible();
        if (!hasGaleButton) {
            console.log('🔴 SYSTEM FAULT: Application loaded, but BG3 Splendor UI was not found (Play as Gale button missing).');
            await browser.close();
            process.exit(1);
        }

        console.log('🟢 PROBE SUCCESS: Cloud Run deployment is live and serving the BG3 Splendor app!');
        await browser.close();
        process.exit(0);

    } catch (e) {
        console.log(`🔴 SYSTEM FAULT: Failed to navigate to URL or verify content. Error: ${e.message}`);
        await browser.close();
        process.exit(1);
    }
})();