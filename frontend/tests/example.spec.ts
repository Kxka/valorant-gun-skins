import { test, expect } from '@playwright/test';

test('homepage loads successfully', async ({ page }) => {
  await page.goto('/');
  
  // Check if the page title or logo is visible
  await expect(page.locator('h1')).toContainText('VALORANT SKINS');
  
  // Take a screenshot for visual verification
  await page.screenshot({ path: 'screenshots/homepage.png', fullPage: true });
});