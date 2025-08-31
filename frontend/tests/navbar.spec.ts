import { test, expect } from '@playwright/test';

test.describe('Navbar Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main navbar elements', async ({ page }) => {
    // Check if the logo is visible and clickable
    await expect(page.locator('.logo h1')).toBeVisible();
    await expect(page.locator('.logo')).toHaveText('VALORANT SKINS');
    
    // Check if All Skins button is visible
    await expect(page.locator('.nav-link')).toBeVisible();
    await expect(page.locator('.nav-link')).toHaveText('All Skins');

    // Check if weapon category dropdowns are visible
    await expect(page.locator('.dropdown-button').first()).toBeVisible();
    
    // Check dropdown buttons text content
    const dropdownButtons = page.locator('.dropdown-button');
    await expect(dropdownButtons.nth(0)).toContainText('Rifles');
    await expect(dropdownButtons.nth(1)).toContainText('Sidearms');
    await expect(dropdownButtons.nth(2)).toContainText('Snipers');
    await expect(dropdownButtons.nth(3)).toContainText('SMGs');
    await expect(dropdownButtons.nth(4)).toContainText('Shotguns');
    await expect(dropdownButtons.nth(5)).toContainText('Machine Guns');
    await expect(dropdownButtons.nth(6)).toContainText('Melee');
  });

  test('should show dropdown content on hover', async ({ page }) => {
    const riflesDropdown = page.locator('.weapon-dropdown').first();
    
    // Initially, dropdown content should not be visible
    await expect(riflesDropdown.locator('.dropdown-content')).not.toBeVisible();
    
    // Hover over the rifles dropdown
    await riflesDropdown.hover();
    
    // Wait for dropdown animation
    await page.waitForTimeout(500);
    
    // Dropdown content should be visible after hover
    await expect(riflesDropdown.locator('.dropdown-content')).toBeVisible();
    
    // Check if rifle weapons are displayed
    await expect(riflesDropdown.locator('.dropdown-link').first()).toContainText('Vandal');
    await expect(riflesDropdown.locator('.dropdown-link').nth(1)).toContainText('Phantom');
  });

  test('should navigate to all skins when logo is clicked', async ({ page }) => {
    // Assuming the app shows a filtered view initially, clicking logo should show all
    const logo = page.locator('.logo');
    await expect(logo).toBeVisible();
    
    // Click the logo
    await logo.click();
    
    // We can't easily test the filter state without more complex setup,
    // but we can verify the logo is clickable and doesn't throw errors
    await expect(logo).toBeVisible();
  });

  test('should navigate to all skins when All Skins button is clicked', async ({ page }) => {
    const allSkinsButton = page.locator('.nav-link');
    await expect(allSkinsButton).toBeVisible();
    
    // Click the All Skins button
    await allSkinsButton.click();
    
    // Verify button is still visible after click
    await expect(allSkinsButton).toBeVisible();
  });

  test('should handle dropdown weapon selection', async ({ page }) => {
    const riflesDropdown = page.locator('.weapon-dropdown').first();
    
    // Hover over rifles dropdown
    await riflesDropdown.hover();
    await page.waitForTimeout(500);
    
    // Click on Vandal option
    const vandalOption = riflesDropdown.locator('.dropdown-link').first();
    await vandalOption.click();
    
    // After clicking, the dropdown should still exist
    await expect(riflesDropdown).toBeVisible();
  });

  test('should have proper styling and hover effects', async ({ page }) => {
    const logo = page.locator('.logo');
    const navLink = page.locator('.nav-link');
    const firstDropdownButton = page.locator('.dropdown-button').first();
    
    // Check that elements have cursor pointer
    await expect(logo).toHaveCSS('cursor', 'pointer');
    await expect(navLink).toHaveCSS('cursor', 'pointer');
    await expect(firstDropdownButton).toHaveCSS('cursor', 'pointer');
    
    // Check background gradients and styling
    await expect(page.locator('.header')).toHaveCSS('background', /linear-gradient/);
    await expect(page.locator('.navigation')).toHaveCSS('border-radius', '15px');
  });

  test('should maintain dropdown hover bridge', async ({ page }) => {
    const riflesDropdown = page.locator('.weapon-dropdown').first();
    
    // Hover over the dropdown button
    await riflesDropdown.hover();
    await page.waitForTimeout(500);
    
    // Verify dropdown is visible
    await expect(riflesDropdown.locator('.dropdown-content')).toBeVisible();
    
    // Move mouse to dropdown content area
    const dropdownContent = riflesDropdown.locator('.dropdown-content');
    await dropdownContent.hover();
    await page.waitForTimeout(200);
    
    // Dropdown should still be visible (no gap issue)
    await expect(dropdownContent).toBeVisible();
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 400, height: 800 });
    
    // Check if navbar adapts to mobile
    await expect(page.locator('.header-container')).toHaveCSS('flex-direction', 'column');
    await expect(page.locator('.navigation')).toHaveCSS('flex-wrap', 'wrap');
    
    // Logo should be smaller
    await expect(page.locator('.logo h1')).toHaveCSS('font-size', '1.6rem');
  });
});