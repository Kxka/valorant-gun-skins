import { test, expect } from '@playwright/test';

test('homepage loads successfully', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  
  // Check if the page title or logo is visible with increased timeout
  await expect(page.locator('h1')).toContainText('VALORANT SKINS', { timeout: 30000 });
  
  // Take a screenshot for visual verification (skip if taking too long)
  try {
    await page.screenshot({ path: 'screenshots/homepage.png', timeout: 10000 });
  } catch (error) {
    console.log('Screenshot skipped due to timeout');
  }
});