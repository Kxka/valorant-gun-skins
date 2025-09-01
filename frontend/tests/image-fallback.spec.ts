import { test, expect } from '@playwright/test';

test.describe('Image Fallback Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show placeholder when skin image fails to load', async ({ page }) => {
    // Wait for any skin cards to load
    await page.waitForSelector('.skin-card', { timeout: 10000 });
    
    // Get the first skin card image
    const firstSkinImage = page.locator('.skin-card-image').first();
    await expect(firstSkinImage).toBeVisible();
    
    // Simulate image load failure by changing src to invalid URL
    await firstSkinImage.evaluate((img: HTMLImageElement) => {
      img.src = 'https://invalid-url-that-will-fail.com/image.jpg';
    });
    
    // Wait for error event to trigger
    await page.waitForTimeout(2000);
    
    // Check if the image src changed to placeholder
    await expect(firstSkinImage).toHaveAttribute('src', '/placeholder-weapon.png');
  });

  test('should use large placeholder in modal when image fails', async ({ page }) => {
    // Wait for skin cards to load
    await page.waitForSelector('.skin-card', { timeout: 10000 });
    
    // Click on first skin card to open modal
    const firstSkinCard = page.locator('.skin-card').first();
    await firstSkinCard.click();
    
    // Wait for modal to appear
    await page.waitForSelector('.skin-modal', { timeout: 5000 });
    
    const modalImage = page.locator('.modal-image');
    await expect(modalImage).toBeVisible();
    
    // Simulate image load failure in modal
    await modalImage.evaluate((img: HTMLImageElement) => {
      img.src = 'https://invalid-url-that-will-fail.com/large-image.jpg';
    });
    
    // Wait for error event to trigger
    await page.waitForTimeout(2000);
    
    // Check if the modal image src changed to large placeholder
    await expect(modalImage).toHaveAttribute('src', '/placeholder-weapon-large.png');
  });

  test('should verify placeholder images exist', async ({ page }) => {
    // Check if placeholder images are accessible
    const smallPlaceholderResponse = await page.request.get('/placeholder-weapon.png');
    expect(smallPlaceholderResponse.ok()).toBeTruthy();
    
    const largePlaceholderResponse = await page.request.get('/placeholder-weapon-large.png');
    expect(largePlaceholderResponse.ok()).toBeTruthy();
  });
});