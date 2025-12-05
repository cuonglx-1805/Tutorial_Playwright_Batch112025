import { test, expect } from '@playwright/test';
import type { Locator, Page } from 'playwright';

export const getElementById = (page: Page, id: string): Locator =>
  page.locator(`#${id}`);

export const getElementAttributeName = (page: Page, name: string): Locator =>
  page.locator(`[name="${name}"]`);

test.describe('W3Schools Search Input Tests', () => {
  test('input text field', async ({ page }) => {
    await page.goto('https://www.w3schools.com/');
    const input = getElementById(page, 'tnb-google-search-input');
    await expect(input).toBeVisible();
    await input.fill('Playwright');
    await expect(input).toHaveValue('Playwright');
  });

  test('should test search input with different values', async ({ page }) => {
    await page.goto('https://www.w3schools.com/');
    const input = getElementById(page, 'tnb-google-search-input');
    
    // Test visibility and editability
    await expect(input).toBeVisible();
    await expect(input).toBeEditable();
    
    // Test filling with HTML
    await input.fill('HTML tutorial');
    await expect(input).toHaveValue('HTML tutorial');
    
    // Test clearing and filling with JavaScript
    await input.clear();
    await input.fill('JavaScript');
    await expect(input).toHaveValue('JavaScript');
  });

  test('should verify search input attributes', async ({ page }) => {
    await page.goto('https://www.w3schools.com/');
    const input = getElementById(page, 'tnb-google-search-input');
    
    // Verify input is visible and enabled
    await expect(input).toBeVisible();
    await expect(input).toBeEnabled();
    
    // Check input type and other attributes
    await expect(input).toHaveAttribute('type', 'text');
    
    // Test placeholder if exists
    const placeholder = await input.getAttribute('placeholder');
    if (placeholder) {
      console.log('Search input placeholder:', placeholder);
    }
  });
});
