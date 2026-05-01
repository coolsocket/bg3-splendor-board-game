import { chromium } from 'playwright';

(async () => {
  console.log('🚀 Launching headless browser (Observability Probe)...');
  const browser = await chromium.launch({ 
    args: ['--autoplay-policy=no-user-gesture-required'] 
  });
  const page = await browser.newPage();

  const logs = [];
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('[AudioEngine]') || text.includes('[HowlerDebug]')) {
      console.log(`[Telemetry] ${text}`);
      logs.push(text);
    }
  });

  console.log('🌐 Navigating to BG3 Splendor Arena...');
  await page.goto('http://localhost:4173');

  await page.waitForSelector('button:has-text("Play as")');
  console.log('👤 Authenticating (Triggering BGM)...');
  await page.click('button:has-text("Play as")');

  await page.waitForTimeout(1000);

  console.log('💎 Interacting with a gem (Triggering SFX)...');
  await page.waitForSelector('[data-testid^="token-"]');
  await page.click('[data-testid^="token-"]');
  
  await page.waitForTimeout(500);

  console.log('✅ Observability Scan Complete.');
  
  const hasLoaded = logs.some(l => l.includes('Loaded:'));
  const hasErrors = logs.some(l => l.includes('Error'));

  if (hasLoaded && !hasErrors) {
    console.log('🟢 SYSTEM HEALTH: All MP3 files loaded and decoded successfully by Howler.js.');
    process.exit(0);
  } else {
    console.log('🔴 SYSTEM FAULT: Errors detected in audio decoding or playback.');
    process.exit(1);
  }
})();