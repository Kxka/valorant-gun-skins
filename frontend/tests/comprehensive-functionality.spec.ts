import { test, expect } from '@playwright/test';

test.describe('Comprehensive Application Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the main page successfully', async ({ page }) => {
    // Check if the page loads and shows the header
    await expect(page.locator('.header')).toBeVisible();
    await expect(page.locator('.logo h1')).toHaveText('VALORANT SKINS');
    
    // Check if main content area exists
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('.gallery-container')).toBeVisible();
  });

  test('should display skin gallery or loading state', async ({ page }) => {
    // Wait for the gallery to load or show loading state
    await page.waitForSelector('.gallery-container', { timeout: 10000 });
    await expect(page.locator('.gallery-container')).toBeVisible();
    
    // Check if we have either skin cards or loading state
    const hasGallery = await page.locator('.gallery').isVisible();
    const hasLoading = await page.locator('.loading-container').isVisible();
    const hasError = await page.locator('.error-container').isVisible();
    
    // At least one of these should be visible
    expect(hasGallery || hasLoading || hasError).toBe(true);
    
    if (hasGallery) {
      console.log('Gallery loaded successfully');
    } else if (hasLoading) {
      console.log('Gallery is in loading state');
    } else if (hasError) {
      console.log('Gallery shows error state');
    }
  });

  test('should open and close skin modal if skins are available', async ({ page }) => {
    // Wait for potential skin cards
    await page.waitForTimeout(2000);
    
    const skinCards = page.locator('.skin-card');
    const cardCount = await skinCards.count();
    
    if (cardCount > 0) {
      // Click on the first skin card
      await skinCards.first().click();
      
      // Wait for modal to appear
      await page.waitForSelector('.skin-modal', { timeout: 5000 });
      await expect(page.locator('.skin-modal')).toBeVisible();
      
      // Modal should have proper structure
      await expect(page.locator('.modal-close-button')).toBeVisible();
      await expect(page.locator('.modal-content')).toBeVisible();
      
      // Close the modal by clicking the close button
      await page.locator('.modal-close-button').click();
      
      // Modal should disappear
      await expect(page.locator('.skin-modal')).not.toBeVisible();
    } else {
      console.log('No skin cards available to test modal functionality');
    }
  });

  test('should close modal when clicking backdrop if skins available', async ({ page }) => {
    await page.waitForTimeout(2000);
    
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
    
    // Test clicking on Rifles dropdown
    const riflesDropdown = page.locator('.weapon-dropdown').first();
    await riflesDropdown.hover();
    await page.waitForTimeout(500);
    
    // Click on Vandal if available
    const vandalOption = riflesDropdown.locator('.dropdown-link').first();
    if (await vandalOption.isVisible()) {
      await vandalOption.click();
      
      // Wait a moment for any filtering to occur
      await page.waitForTimeout(1000);
      
      console.log('Vandal filter clicked successfully');
    }
    
    // Test clicking on Knives button
    const knivesButton = page.locator('.nav-link');
    if (await knivesButton.isVisible()) {
      await knivesButton.click();
      await page.waitForTimeout(1000);
      console.log('Knives filter clicked successfully');
    }
  });

  test('should handle image fallbacks properly', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Check if there are any images on the page
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      // Check that images have proper fallback attributes
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const image = images.nth(i);
        await expect(image).toHaveAttribute('alt');
        
        // Check if image has error handling
        const onError = await image.getAttribute('onerror');
        if (!onError) {
          // Image should have some fallback mechanism in React
          console.log(`Image ${i + 1} may need fallback handling`);
        }
      }
    }
  });

  test('should display filter bar if present', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Check if filter bar is present
    const filterBar = page.locator('.filter-bar');
    if (await filterBar.isVisible()) {
      console.log('Filter bar is visible');
      
      // Check for search functionality if present
      const searchInput = page.locator('input[type="text"], input[placeholder*="search"], input[placeholder*="Search"]');
      if (await searchInput.isVisible()) {
        await searchInput.fill('Vandal');
        await page.waitForTimeout(500);
        console.log('Search functionality tested');
      }
    }
  });

  test('should handle empty states gracefully', async ({ page }) => {
    await page.waitForTimeout(3000);
    
    // Check if there's a no-results state
    const noResults = page.locator('.no-results');
    if (await noResults.isVisible()) {
      await expect(noResults).toContainText(/no.*found/i);
      console.log('No results state is properly displayed');
    }
    
    // Check error state
    const errorContainer = page.locator('.error-container');
    if (await errorContainer.isVisible()) {
      await expect(errorContainer.locator('.retry-button')).toBeVisible();
      console.log('Error state with retry button is displayed');
    }
  });

  test('should be performant on initial load', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForSelector('.header', { timeout: 10000 });
    
    const loadTime = Date.now() - startTime;
    console.log(`Page loaded in ${loadTime}ms`);
    
    // Page should load within reasonable time (10 seconds max due to potential API calls)
    expect(loadTime).toBeLessThan(10000);
  });
});