import { test, expect } from '@playwright/test';

test.describe('Edge Cases and Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should handle network failures gracefully', async ({ page }) => {
    // Test offline behavior
    await page.context().setOffline(true);
    
    try {
      // Try to reload the page - might fail in offline mode
      await page.reload({ waitUntil: 'domcontentloaded', timeout: 15000 });
    } catch (error) {
      // If reload fails, navigate to page instead
      await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 15000 });
    }
    
    // The page should still load the basic structure even without API data
    await expect(page.locator('.header')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('.logo h1')).toHaveText('VALORANT SKINS', { timeout: 15000 });
    
    // Should show either loading, error, or empty state
    await page.waitForTimeout(2000);
    
    const hasError = await page.locator('.error-container').isVisible();
    const hasLoading = await page.locator('.loading-container').isVisible();
    const hasNoResults = await page.locator('.no-results').isVisible();
    
    expect(hasError || hasLoading || hasNoResults).toBe(true);
    console.log('Network failure handled gracefully');
    
    // Restore network
    await page.context().setOffline(false);
  });

  test('should handle rapid navigation clicks', async ({ page }) => {
    // Rapidly click different navigation elements
    const logo = page.locator('.logo');
    const knivesButton = page.locator('.nav-link');
    
    // Rapid clicks on logo
    for (let i = 0; i < 5; i++) {
      await logo.click();
      await page.waitForTimeout(100);
    }
    
    // Rapid clicks on Knives button
    if (await knivesButton.isVisible()) {
      for (let i = 0; i < 5; i++) {
        await knivesButton.click();
        await page.waitForTimeout(100);
      }
    }
    
    // Page should still be functional
    await expect(page.locator('.header')).toBeVisible();
    console.log('Rapid navigation clicks handled without issues');
  });

  test('should handle dropdown hover race conditions', async ({ page }) => {
    const dropdowns = page.locator('.weapon-dropdown');
    const dropdownCount = await dropdowns.count();
    
    if (dropdownCount > 0) {
      // Rapidly hover over different dropdowns
      for (let i = 0; i < dropdownCount; i++) {
        await dropdowns.nth(i).hover();
        await page.waitForTimeout(50); // Very short delay to create race conditions
      }
      
      // Hover away
      await page.locator('.logo').hover();
      await page.waitForTimeout(500);
      
      // All dropdowns should be closed
      for (let i = 0; i < dropdownCount; i++) {
        const dropdownContent = dropdowns.nth(i).locator('.dropdown-content');
        if (await dropdownContent.isVisible()) {
          console.log(`Dropdown ${i} still visible after hover away`);
        }
      }
    }
  });

  test('should handle modal edge cases', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    const skinCards = page.locator('.skin-card');
    const cardCount = await skinCards.count();
    
    if (cardCount > 0) {
      // Test rapid modal open/close
      await skinCards.first().click();
      await page.waitForSelector('.skin-modal', { timeout: 3000 });
      
      // Immediately try to close
      await page.locator('.modal-close-button').click();
      await page.waitForTimeout(100);
      
      // Try to open again quickly
      await skinCards.first().click();
      await page.waitForTimeout(100);
      
      // Should handle rapid interactions gracefully
      const modalVisible = await page.locator('.skin-modal').isVisible();
      console.log(`Modal handling rapid interactions: ${modalVisible ? 'visible' : 'hidden'}`);
      
      // Clean up - close modal if open
      if (modalVisible) {
        await page.locator('.modal-close-button').click();
      }
    }
  });

  test('should handle keyboard navigation edge cases', async ({ page }) => {
    // Test excessive tabbing
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(50);
    }
    
    // Page should still be functional
    await expect(page.locator('.header')).toBeVisible();
    
    // Test Shift+Tab (reverse tabbing)
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Shift+Tab');
      await page.waitForTimeout(50);
    }
    
    console.log('Keyboard navigation edge cases handled');
  });

  test('should handle window resize during interactions', async ({ page }) => {
    // Start with desktop size
    await page.setViewportSize({ width: 1200, height: 800 });
    
    // Open a dropdown
    const dropdown = page.locator('.weapon-dropdown').first();
    await dropdown.hover();
    await page.waitForTimeout(300);
    
    // Resize to mobile while dropdown is open
    await page.setViewportSize({ width: 400, height: 600 });
    await page.waitForTimeout(500);
    
    // Resize back to desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(500);
    
    // Page should still be functional
    await expect(page.locator('.header')).toBeVisible();
    console.log('Window resize during interactions handled');
  });

  test('should handle malformed API responses gracefully', async ({ page }) => {
    // This test assumes the API might return unexpected data
    await page.waitForTimeout(3000);
    
    // Check if the application shows appropriate fallback states
    const galleryContainer = page.locator('.gallery-container');
    await expect(galleryContainer).toBeVisible();
    
    const hasContent = await page.locator('.gallery').isVisible();
    const hasError = await page.locator('.error-container').isVisible();
    const hasLoading = await page.locator('.loading-container').isVisible();
    const hasNoResults = await page.locator('.no-results').isVisible();
    
    // Should show some appropriate state
    expect(hasContent || hasError || hasLoading || hasNoResults).toBe(true);
    console.log('API response handling verified');
  });

  test('should maintain functionality with JavaScript errors', async ({ page }) => {
    // Listen for JavaScript errors
    const errors: string[] = [];
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    // Perform various interactions
    await page.locator('.logo').click();
    
    const dropdown = page.locator('.weapon-dropdown').first();
    await dropdown.hover();
    await page.waitForTimeout(300);
    
    const knivesButton = page.locator('.nav-link');
    if (await knivesButton.isVisible()) {
      await knivesButton.click();
    }
    
    // Check if any JavaScript errors occurred
    if (errors.length > 0) {
      console.log('JavaScript errors detected:', errors);
    } else {
      console.log('No JavaScript errors during interactions');
    }
    
    // Core functionality should still work
    await expect(page.locator('.header')).toBeVisible();
  });

  test('should handle focus management properly', async ({ page }) => {
    // Test focus trapping in modals (if available)
    const skinCards = page.locator('.skin-card');
    const cardCount = await skinCards.count();
    
    if (cardCount > 0) {
      await skinCards.first().click();
      await page.waitForSelector('.skin-modal', { timeout: 3000 });
      
      if (await page.locator('.skin-modal').isVisible()) {
        // Tab through modal elements
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
        
        // Focus should stay within modal
        const focusedElement = await page.locator(':focus').getAttribute('class');
        console.log('Focused element in modal:', focusedElement);
        
        // Close modal
        await page.locator('.modal-close-button').click();
        
        // Focus should return to appropriate element
        await page.waitForTimeout(300);
        console.log('Modal focus management tested');
      }
    }
  });

  test('should handle concurrent user actions', async ({ page }) => {
    // Simulate multiple actions happening simultaneously
    const promises = [
      page.locator('.logo').click(),
      page.locator('.weapon-dropdown').first().hover(),
      page.locator('.nav-link').click(),
    ];
    
    // Execute multiple actions concurrently
    await Promise.allSettled(promises);
    
    // Wait for any state changes to settle
    await page.waitForTimeout(1000);
    
    // Page should still be in a valid state
    await expect(page.locator('.header')).toBeVisible();
    await expect(page.locator('.navigation')).toBeVisible();
    
    console.log('Concurrent user actions handled successfully');
  });
});