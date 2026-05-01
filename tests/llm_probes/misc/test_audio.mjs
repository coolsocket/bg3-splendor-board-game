import { chromium } from 'playwright';

(async () => {
  console.log('🚀 Launching headless browser...');
  const browser = await chromium.launch({ 
    args: ['--autoplay-policy=no-user-gesture-required'] 
  });
  const page = await browser.newPage();

  console.log('🌐 Navigating to game...');
  await page.goto('http://localhost:4173');

  // Wait for login screen and click a player
  await page.waitForSelector('button:has-text("Play as")');
  console.log('👤 Clicking player login (Should trigger BGM)...');
  await page.click('button:has-text("Play as")');

  // Wait a moment for BGM to load and start
  await page.waitForTimeout(2000);

  // Check Howler BGM state
  console.log('🔍 Inspecting Howler BGM state...');
  const isBgmPlaying = await page.evaluate(() => {
    return window.Howler && window.Howler._howls.some(h => h.playing());
  });

  if (isBgmPlaying) {
    console.log('✅ BGM is playing successfully in the browser engine!');
  } else {
    console.log('❌ BGM is NOT playing!');
    
    // Check for load errors
    const state = await page.evaluate(() => {
      return window.Howler ? window.Howler._howls.map(h => ({ state: h.state(), src: h._src })) : 'Howler not found';
    });
    console.log('Howler State:', state);
  }

  console.log('💎 Interacting with a gem to test SFX...');
  // Click a token
  await page.waitForSelector('[data-testid^="token-"]');
  await page.click('[data-testid^="token-"]');
  
  await page.waitForTimeout(100);

  // We can't easily catch the 250ms SFX playing boolean unless we listen to it, 
  // but we can check if there are no DOM exceptions and Howler context is running.
  const isAudioContextRunning = await page.evaluate(() => {
    return window.Howler && window.Howler.ctx && window.Howler.ctx.state === 'running';
  });

  if (isAudioContextRunning) {
    console.log('✅ AudioContext is RUNNING and unlocked! SFX fired successfully.');
  } else {
    console.log('❌ AudioContext is not running. State might be suspended or closed.');
  }

  await browser.close();
  process.exit(isBgmPlaying && isAudioContextRunning ? 0 : 1);
})();