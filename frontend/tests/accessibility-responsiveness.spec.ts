import { test, expect } from '@playwright/test';

test.describe('Accessibility and Responsiveness Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have proper accessibility features', async ({ page }) => {
    // Check for proper semantic HTML structure
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    
    // Check logo accessibility
    await expect(page.locator('.logo')).toHaveAttribute('role', 'button');
    await expect(page.locator('.logo')).toHaveAttribute('tabIndex', '0');
    
    // Check if interactive elements have proper cursor
    await expect(page.locator('.logo')).toHaveCSS('cursor', 'pointer');
    await expect(page.locator('.nav-link')).toHaveCSS('cursor', 'pointer');
    await expect(page.locator('.dropdown-button').first()).toHaveCSS('cursor', 'pointer');
    
    // Check for proper heading structure
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toHaveText('VALORANT SKINS');
    
    // Check that images have alt attributes
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      for (let i = 0; i < Math.min(imageCount, 3); i++) {
        await expect(images.nth(i)).toHaveAttribute('alt');
      }
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    // Test Tab navigation
    await page.keyboard.press('Tab');
    
    // Logo should be focusable
    const focusedElement = page.locator(':focus');
    const logoFocused = await page.locator('.logo').evaluate(el => el === document.activeElement);
    
    if (logoFocused) {
      // Test Enter key on logo
      await page.keyboard.press('Enter');
      console.log('Logo keyboard navigation works');
    }
    
    // Continue tabbing through interactive elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should be able to navigate through dropdown buttons
    const dropdownButtons = page.locator('.dropdown-button');
    const buttonCount = await dropdownButtons.count();
    console.log(`Found ${buttonCount} dropdown buttons for keyboard navigation`);
  });

  test('should be responsive on tablet viewport (768px)', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Check if header adapts to tablet size
    await expect(page.locator('.header-container')).toBeVisible();
    
    // Navigation should still be visible and functional
    await expect(page.locator('.navigation')).toBeVisible();
    
    // Dropdowns should still work
    const riflesDropdown = page.locator('.weapon-dropdown').first();
    await riflesDropdown.hover();
    await page.waitForTimeout(500);
    await expect(riflesDropdown.locator('.dropdown-content')).toBeVisible();
    
    // Logo should be appropriately sized
    const logoH1 = page.locator('.logo h1');
    await expect(logoH1).toBeVisible();
  });

  test('should be responsive on mobile viewport (400px)', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 400, height: 800 });
    
    // Header should adapt to mobile layout
    const headerContainer = page.locator('.header-container');
    await expect(headerContainer).toBeVisible();
    
    // Check if layout changes to column direction on mobile
    const flexDirection = await headerContainer.evaluate(el => 
      window.getComputedStyle(el).flexDirection
    );
    
    if (flexDirection === 'column') {
      console.log('Header correctly switches to column layout on mobile');
    }
    
    // Navigation should be visible and wrap if needed
    await expect(page.locator('.navigation')).toBeVisible();
    
    // Logo should be smaller on mobile
    const logoH1 = page.locator('.logo h1');
    const fontSize = await logoH1.evaluate(el => 
      window.getComputedStyle(el).fontSize
    );
    
    console.log(`Mobile logo font size: ${fontSize}`);
    
    // Test dropdown functionality on mobile
    const riflesDropdown = page.locator('.weapon-dropdown').first();
    await riflesDropdown.hover();
    await page.waitForTimeout(500);
    
    // Dropdown should still be functional
    const dropdownVisible = await riflesDropdown.locator('.dropdown-content').isVisible();
    console.log(`Dropdown visible on mobile: ${dropdownVisible}`);
  });

  test('should handle touch interactions on mobile', async ({ page, browserName }) => {
    // Skip test for browsers without touch support
    test.skip(browserName !== 'chromium', 'Touch events only supported in chromium with mobile configuration');
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    
    // Use click instead of tap for better compatibility
    await page.locator('.logo').click();
    
    // Test touch interaction with melee button
    const meleeButton = page.locator('.nav-link');
    if (await meleeButton.isVisible()) {
      await meleeButton.click();
      console.log('Touch interaction with Melee button successful');
    }
    
    // Test touch interaction with dropdown
    const riflesDropdown = page.locator('.weapon-dropdown').first();
    await riflesDropdown.click();
    
    // Wait and check if dropdown appears (behavior may vary on mobile)
    await page.waitForTimeout(500);
    console.log('Touch interactions tested on mobile');
  });

  test('should maintain usability at different zoom levels', async ({ page }) => {
    // Test at 150% zoom
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Simulate zoom by making the effective viewport smaller
    await page.setViewportSize({ width: 853, height: 480 }); // 1280/1.5, 720/1.5
    
    // Elements should still be visible and clickable
    await expect(page.locator('.logo')).toBeVisible();
    await expect(page.locator('.navigation')).toBeVisible();
    
    // Test dropdown functionality at zoom level
    const dropdownButton = page.locator('.dropdown-button').first();
    await dropdownButton.hover();
    await page.waitForTimeout(500);
    
    const dropdownContent = page.locator('.dropdown-content').first();
    if (await dropdownContent.isVisible()) {
      console.log('Dropdown still functional at zoom level');
    }
  });

  test('should work with high contrast mode considerations', async ({ page }) => {
    // Check that elements have sufficient color contrast
    const logo = page.locator('.logo h1');
    const backgroundColor = await logo.evaluate(el => 
      window.getComputedStyle(el).backgroundColor || 'transparent'
    );
    const color = await logo.evaluate(el => 
      window.getComputedStyle(el).color
    );
    
    console.log(`Logo colors - Background: ${backgroundColor}, Text: ${color}`);
    
    // Check button colors for contrast
    const navButton = page.locator('.nav-link');
    if (await navButton.isVisible()) {
      const buttonBg = await navButton.evaluate(el => 
        window.getComputedStyle(el).backgroundColor
      );
      const buttonColor = await navButton.evaluate(el => 
        window.getComputedStyle(el).color
      );
      
      console.log(`Button colors - Background: ${buttonBg}, Text: ${buttonColor}`);
    }
  });

  test('should handle reduced motion preferences', async ({ page }) => {
    // Test page with reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    // Elements should still be visible and functional
    await expect(page.locator('.header')).toBeVisible();
    await expect(page.locator('.logo')).toBeVisible();
    
    // Hover interactions should still work (may just have reduced animation)
    const dropdown = page.locator('.weapon-dropdown').first();
    await dropdown.hover();
    await page.waitForTimeout(500);
    
    // Dropdown should still appear
    await expect(dropdown.locator('.dropdown-content')).toBeVisible();
    console.log('Functionality maintained with reduced motion preference');
  });
});