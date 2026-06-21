import { test } from '@playwright/test';

test('Capture beautiful screenshot of the game arena', async ({ page }) => {
  // Set test timeout to 60 seconds to ensure no timeout issues during asset fetching
  test.setTimeout(60000);

  // Set viewport to 1920x1080 to give the physical UI elements plenty of space and look premium
  await page.setViewportSize({ width: 1920, height: 1080 });

  // Navigate to the local Vite port defined in playwright.config.ts
  await page.goto('http://localhost:5175');

  // Click on any "Play as" button to login and enter the arena
  await page.waitForSelector('button:has-text("Play as")', { state: 'visible', timeout: 15000 });
  await page.click('button:has-text("Play as")');

  // Wait for the main resource pool and game board to load
  await page.waitForSelector('.public-resource-pool', { state: 'visible', timeout: 15000 });
  
  // Wait a fixed 10 seconds for all GCS image assets to download and Framer Motion entrance animations to settle completely
  await page.waitForTimeout(10000);

  // Capture the screenshot and overwrite the old one
  await page.screenshot({ path: 'tests/assets/screenshot.png' });
  console.log('--- PREMIUM SCREENSHOT CAPTURED SUCCESSFULLY ---');
});
