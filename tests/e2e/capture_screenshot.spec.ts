import { test } from '@playwright/test';

test('Capture beautiful screenshot of the game arena', async ({ page }) => {
  // Set viewport to a nice desktop size for premium appearance
  await page.setViewportSize({ width: 1440, height: 900 });

  // Navigate to the local Vite port defined in playwright.config.ts
  await page.goto('http://localhost:5175');

  // Click on any "Play as" button to login and enter the arena
  await page.waitForSelector('button:has-text("Play as")', { state: 'visible', timeout: 10000 });
  await page.click('button:has-text("Play as")');

  // Wait for the main resource pool and game board to load
  await page.waitForSelector('.public-resource-pool', { state: 'visible', timeout: 15000 });
  
  // Wait 3 seconds to ensure all animations, fonts, and custom styles are fully settled
  await page.waitForTimeout(3000);

  // Capture the screenshot and overwrite the old one
  await page.screenshot({ path: 'tests/assets/screenshot.png' });
  console.log('--- SCREENSHOT CAPTURED SUCCESSFULLY ---');
});
