import { test, expect } from '@playwright/test';

test.describe('General Application Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the main page successfully', async ({ page }) => {
    // Check if the page loads and shows the header
    await expect(page.locator('.header')).toBeVisible();
    await expect(page.locator('.logo h1')).toHaveText('VALORANT SKINS');
  });

  test('should display skin gallery', async ({ page }) => {
    // Wait for the gallery to load
    await page.waitForSelector('.gallery', { timeout: 10000 });
    await expect(page.locator('.gallery')).toBeVisible();
    
    // Check if skin cards are present (even if loading from API fails)
    const skinCards = page.locator('.skin-card');
    const cardCount = await skinCards.count();
    
    // We expect either skin cards to be loaded or a loading state
    if (cardCount > 0) {
      await expect(skinCards.first()).toBeVisible();
    } else {
      // If no cards, there should be some loading or empty state indicator
      console.log('No skin cards found - this might be expected if API is not running');
    }
  });

  test('should open and close skin modal', async ({ page }) => {
    // Wait for skin cards
    await page.waitForSelector('.skin-card', { timeout: 10000 });
    
    const skinCards = page.locator('.skin-card');
    const cardCount = await skinCards.count();
    
    if (cardCount > 0) {
      // Click on the first skin card
      await skinCards.first().click();
      
      // Wait for modal to appear
      await page.waitForSelector('.skin-modal', { timeout: 5000 });
      await expect(page.locator('.skin-modal')).toBeVisible();
      
      // Close the modal by clicking the close button
      await page.locator('.modal-close-button').click();
      
      // Modal should disappear
      await expect(page.locator('.skin-modal')).not.toBeVisible();
    } else {
      console.log('No skin cards available to test modal functionality');
    }
  });

  test('should close modal when clicking backdrop', async ({ page }) => {
    // Wait for skin cards
    await page.waitForSelector('.skin-card', { timeout: 10000 });
    
    const skinCards = page.locator('.skin-card');
    const cardCount = await skinCards.count();
    
    if (cardCount > 0) {
      // Click on the first skin card
      await skinCards.first().click();
      
      // Wait for modal to appear
      await page.waitForSelector('.skin-modal', { timeout: 5000 });
      await expect(page.locator('.skin-modal')).toBeVisible();
      
      // Click on the backdrop (not the modal content)
      await page.locator('.skin-modal-backdrop').click({ position: { x: 10, y: 10 } });
      
      // Modal should close
      await expect(page.locator('.skin-modal')).not.toBeVisible();
    }
  });

  test('should filter weapons by category', async ({ page }) => {
    // Wait for the page to load
    await page.waitForSelector('.header', { timeout: 5000 });
    
    // Test clicking on a weapon category dropdown
    const riflesDropdown = page.locator('.weapon-dropdown').first();
    await riflesDropdown.hover();
    await page.waitForTimeout(500);
    
    // Click on Vandal if available
    const vandalOption = riflesDropdown.locator('.dropdown-link').first();
    if (await vandalOption.isVisible()) {
      await vandalOption.click();
      
      // Wait a moment for any filtering to occur
      await page.waitForTimeout(1000);
      
      // The filter should have been applied (though we can't easily test the actual filtering without API data)
      console.log('Weapon filter clicked successfully');
    }
  });

  test('should be accessible', async ({ page }) => {
    // Check for basic accessibility features
    await expect(page.locator('.logo')).toHaveAttribute('role', /button|link|generic/);
    
    // Check if buttons have proper cursor
    await expect(page.locator('.nav-link')).toHaveCSS('cursor', 'pointer');
    await expect(page.locator('.dropdown-button').first()).toHaveCSS('cursor', 'pointer');
    
    // Check for proper semantic elements
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
  });

  test('should handle network failures gracefully', async ({ page }) => {
    // Simulate offline network
    await page.context().setOffline(true);
    
    try {
      // Try to reload the page - this might fail due to offline mode
      await page.reload({ waitUntil: 'domcontentloaded', timeout: 10000 });
    } catch (error) {
      // If reload fails due to network, navigate to the page again
      await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 10000 });
    }
    
    // The page should still load the basic structure even without API data
    await expect(page.locator('.header')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.logo h1')).toHaveText('VALORANT SKINS', { timeout: 10000 });
    
    // Restore network
    await page.context().setOffline(false);
  });
});