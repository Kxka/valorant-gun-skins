import { test, expect } from '@playwright/test';

test.describe('Updated Navbar Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display correct navbar elements', async ({ page }) => {
    // Check if the logo is visible and clickable
    await expect(page.locator('.logo h1')).toBeVisible();
    await expect(page.locator('.logo')).toHaveText('VALORANT SKINS');
    await expect(page.locator('.logo')).toHaveAttribute('role', 'button');

    // Check if weapon category dropdowns are visible (no All Skins button)
    const dropdownButtons = page.locator('.dropdown-button');
    await expect(dropdownButtons).toHaveCount(5); // Rifles, Sidearms, Snipers, Shotguns, Machine Guns
    
    // Check dropdown buttons text content
    await expect(dropdownButtons.nth(0)).toContainText('Rifles');
    await expect(dropdownButtons.nth(1)).toContainText('Sidearms');
    await expect(dropdownButtons.nth(2)).toContainText('Snipers');
    await expect(dropdownButtons.nth(3)).toContainText('Shotguns');
    await expect(dropdownButtons.nth(4)).toContainText('Machine Guns');

    // Check if Melee button is visible (not dropdown)
    await expect(page.locator('.nav-link')).toBeVisible();
    await expect(page.locator('.nav-link')).toHaveText('Melee');
  });

  test('should show dropdown content on hover for weapon categories', async ({ page }) => {
    const riflesDropdown = page.locator('.weapon-dropdown').first();
    
    // Initially, dropdown content should not be visible
    await expect(riflesDropdown.locator('.dropdown-content')).not.toBeVisible();
    
    // Hover over the rifles dropdown
    await riflesDropdown.hover();
    await page.waitForTimeout(500);
    
    // Dropdown content should be visible after hover
    await expect(riflesDropdown.locator('.dropdown-content')).toBeVisible();
    
    // Check if rifle weapons are displayed
    await expect(riflesDropdown.locator('.dropdown-link').first()).toContainText('Vandal');
    await expect(riflesDropdown.locator('.dropdown-link').nth(1)).toContainText('Phantom');
    await expect(riflesDropdown.locator('.dropdown-link').nth(2)).toContainText('Guardian');
    await expect(riflesDropdown.locator('.dropdown-link').nth(3)).toContainText('Bulldog');
  });

  test('should show machine guns dropdown with SMGs included', async ({ page }) => {
    const machineGunsDropdown = page.locator('.weapon-dropdown').nth(4);
    
    // Hover over machine guns dropdown
    await machineGunsDropdown.hover();
    await page.waitForTimeout(500);
    
    // Check that it includes both traditional machine guns and SMGs
    await expect(machineGunsDropdown.locator('.dropdown-content')).toBeVisible();
    const dropdownLinks = machineGunsDropdown.locator('.dropdown-link');
    
    // Should contain: Odin, Ares, Spectre, Stinger
    await expect(dropdownLinks).toHaveCount(4);
    await expect(dropdownLinks.nth(0)).toContainText('Odin');
    await expect(dropdownLinks.nth(1)).toContainText('Ares');
    await expect(dropdownLinks.nth(2)).toContainText('Spectre');
    await expect(dropdownLinks.nth(3)).toContainText('Stinger');
  });

  test('should navigate when logo is clicked', async ({ page }) => {
    const logo = page.locator('.logo');
    await expect(logo).toBeVisible();
    
    // Click the logo
    await logo.click();
    
    // Logo should still be visible (navigation to "all skins" view)
    await expect(logo).toBeVisible();
  });

  test('should handle dropdown weapon selection', async ({ page }) => {
    const sidearmDropdown = page.locator('.weapon-dropdown').nth(1);
    
    // Hover over sidearms dropdown
    await sidearmDropdown.hover();
    await page.waitForTimeout(500);
    
    // Click on Sheriff option
    const sheriffOption = sidearmDropdown.locator('.dropdown-link').first();
    await expect(sheriffOption).toContainText('Sheriff');
    await sheriffOption.click();
    
    // After clicking, the dropdown should still exist
    await expect(sidearmDropdown).toBeVisible();
  });

  test('should handle melee button click', async ({ page }) => {
    const meleeButton = page.locator('.nav-link');
    await expect(meleeButton).toBeVisible();
    await expect(meleeButton).toHaveText('Melee');
    
    // Click the Melee button
    await meleeButton.click();
    
    // Verify button is still visible after click
    await expect(meleeButton).toBeVisible();
  });

  test('should have proper styling and hover effects', async ({ page }) => {
    const logo = page.locator('.logo');
    const meleeButton = page.locator('.nav-link');
    const firstDropdownButton = page.locator('.dropdown-button').first();
    
    // Check that elements have cursor pointer
    await expect(logo).toHaveCSS('cursor', 'pointer');
    await expect(meleeButton).toHaveCSS('cursor', 'pointer');
    await expect(firstDropdownButton).toHaveCSS('cursor', 'pointer');
    
    // Check background gradients and styling
    await expect(page.locator('.header')).toHaveCSS('background', /linear-gradient/);
    await expect(page.locator('.navigation')).toHaveCSS('border-radius', '15px');
  });

  test('should maintain dropdown hover bridge', async ({ page }) => {
    const snipersDropdown = page.locator('.weapon-dropdown').nth(2);
    
    // Hover over the dropdown button
    await snipersDropdown.hover();
    await page.waitForTimeout(500);
    
    // Verify dropdown is visible
    await expect(snipersDropdown.locator('.dropdown-content')).toBeVisible();
    
    // Move mouse to dropdown content area
    const dropdownContent = snipersDropdown.locator('.dropdown-content');
    await dropdownContent.hover();
    await page.waitForTimeout(200);
    
    // Dropdown should still be visible (no gap issue)
    await expect(dropdownContent).toBeVisible();
    
    // Check sniper weapons
    await expect(dropdownContent.locator('.dropdown-link').nth(0)).toContainText('Operator');
    await expect(dropdownContent.locator('.dropdown-link').nth(1)).toContainText('Marshal');
    await expect(dropdownContent.locator('.dropdown-link').nth(2)).toContainText('Outlaw');
  });
});