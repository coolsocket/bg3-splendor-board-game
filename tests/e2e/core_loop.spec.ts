import { test, expect } from '@playwright/test';

test('Core game loop: take 3 different tokens', async ({ page }) => {
  page.on('console', msg => console.log(`BROWSER: ${msg.text()}`));
  await page.goto('http://localhost:5175');

  // Wait for the game to be visible
  await expect(page.locator('.public-resource-pool')).toBeVisible();

  // Click 3 different tokens using JS evaluate to bypass any overlay/CSS issues
  await page.locator('[data-testid="token-RADIANT_GEM"]').click();
  await expect(page.locator('.staged-tokens .token')).toHaveCount(1);

  await page.locator('[data-testid="token-ARCANE_CRYSTAL"]').click();
  await expect(page.locator('.staged-tokens .token')).toHaveCount(2);

  await page.locator('[data-testid="token-NATURES_BLESSING"]').click();
  await expect(page.locator('.staged-tokens .token')).toHaveCount(3);

  // Click CONFIRM
  await page.locator('button:has-text("CONFIRM")').click();

  // Verify staging area disappears
  await expect(page.locator('.staging-area')).not.toBeVisible();

  // Verify event is logged (balance update not implemented in UI prototype)
  await page.locator('[aria-label="Open History"]').click({ force: true });
  
  // Wait for Drawer to open and content to be visible
  await expect(page.locator('span:has-text("History")')).toBeVisible();
  
  const logTable = page.locator('table');
  await expect(logTable).toContainText('took tokens');
  await expect(logTable).toContainText('radiant_gem');
});
