import { test, expect } from '@playwright/test';
import type { Page } from 'playwright';

// Helper function to login
async function login(page: Page, username: string = 'standard_user', password: string = 'secret_sauce') {
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', username);
  await page.fill('#password', password);
  await page.click('#login-button');
  // Wait for navigation to inventory page after login
  await page.waitForURL('**/inventory.html');
}

test.describe('Bài 3 - Kiểm tra trạng thái giỏ hàng', () => {
  test('should show cart badge as 1 after adding first product', async ({ page }) => {
    // Login
    await login(page);
    
    // Verify we're on inventory page
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    
    // Add first product to cart
    await page.click('#add-to-cart-sauce-labs-backpack');
    
    // Verify cart badge shows 1
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toBeVisible();
    await expect(cartBadge).toHaveText('1');
  });

  test('should show cart badge as 2 after adding two products', async ({ page }) => {
    // Login
    await login(page);
    
    // Verify we're on inventory page
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    
    // Add first product
    await page.click('#add-to-cart-sauce-labs-backpack');
    
    // Verify cart badge shows 1
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('1');
    
    // Add second product
    await page.click('#add-to-cart-sauce-labs-bike-light');
    
    // Verify cart badge shows 2
    await expect(cartBadge).toHaveText('2');
  });

  test('should increment cart badge when adding multiple products', async ({ page }) => {
    // Login
    await login(page);
    
    const cartBadge = page.locator('.shopping_cart_badge');
    
    // Add first product
    await page.click('#add-to-cart-sauce-labs-backpack');
    await expect(cartBadge).toHaveText('1');
    
    // Add second product
    await page.click('#add-to-cart-sauce-labs-bike-light');
    await expect(cartBadge).toHaveText('2');
    
    // Add third product
    await page.click('#add-to-cart-sauce-labs-bolt-t-shirt');
    await expect(cartBadge).toHaveText('3');
  });

  test('should decrement cart badge when removing product', async ({ page }) => {
    // Login
    await login(page);
    
    const cartBadge = page.locator('.shopping_cart_badge');
    
    // Add two products
    await page.click('#add-to-cart-sauce-labs-backpack');
    await page.click('#add-to-cart-sauce-labs-bike-light');
    await expect(cartBadge).toHaveText('2');
    
    // Remove one product
    await page.click('#remove-sauce-labs-backpack');
    await expect(cartBadge).toHaveText('1');
    
    // Remove second product
    await page.click('#remove-sauce-labs-bike-light');
    
    // Cart badge should disappear when cart is empty
    await expect(cartBadge).not.toBeVisible();
  });
});

test.describe('Bài 4 - Login và Logout', () => {
  test('should login and logout successfully', async ({ page }) => {
    // Login to system
    await login(page);
    
    // Verify login successful - should be on inventory page
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    
    // Open left menu
    await page.click('#react-burger-menu-btn');
    
    // Wait for menu to be visible
    await page.waitForSelector('#logout_sidebar_link', { state: 'visible' });
    
    // Click Logout
    await page.click('#logout_sidebar_link');
    
    // Verify back to login page
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    
    // Verify login form is visible
    await expect(page.locator('#login-button')).toBeVisible();
  });

  test('should verify all menu items visible after opening burger menu', async ({ page }) => {
    // Login
    await login(page);
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    
    // Open burger menu
    await page.click('#react-burger-menu-btn');
    await page.waitForSelector('#logout_sidebar_link', { state: 'visible' });
    
    // Verify all menu items are visible
    await expect(page.locator('#inventory_sidebar_link')).toBeVisible();
    await expect(page.locator('#about_sidebar_link')).toBeVisible();
    await expect(page.locator('#logout_sidebar_link')).toBeVisible();
    await expect(page.locator('#reset_sidebar_link')).toBeVisible();
    
    // Click logout
    await page.click('#logout_sidebar_link');
    
    // Verify back to login page
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('should open and close burger menu', async ({ page }) => {
    // Login
    await login(page);
    
    // Open burger menu
    await page.click('#react-burger-menu-btn');
    
    // Verify menu items are visible
    await expect(page.locator('#logout_sidebar_link')).toBeVisible();
    await expect(page.locator('#inventory_sidebar_link')).toBeVisible();
    
    // Close menu
    await page.click('#react-burger-cross-btn');
    
    // Wait for menu to close
    await page.waitForTimeout(500);
    
    // Verify still on inventory page
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });

  test('should navigate through all menu options', async ({ page }) => {
    // Login
    await login(page);
    
    // Open menu
    await page.click('#react-burger-menu-btn');
    await page.waitForSelector('#logout_sidebar_link', { state: 'visible' });
    
    // Verify all menu items exist
    await expect(page.locator('#inventory_sidebar_link')).toBeVisible();
    await expect(page.locator('#about_sidebar_link')).toBeVisible();
    await expect(page.locator('#logout_sidebar_link')).toBeVisible();
    await expect(page.locator('#reset_sidebar_link')).toBeVisible();
  });
});

test.describe('Combined Tests - Cart and Logout', () => {
  test('should maintain cart state before logout', async ({ page }) => {
    // Login
    await login(page);
    
    // Add products to cart
    await page.click('#add-to-cart-sauce-labs-backpack');
    await page.click('#add-to-cart-sauce-labs-bike-light');
    
    // Verify cart has 2 items
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('2');
    
    // Go to cart page
    await page.click('.shopping_cart_link');
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    
    // Verify 2 items in cart
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(2);
    
    // Go back to inventory
    await page.click('#continue-shopping');
    
    // Logout
    await page.click('#react-burger-menu-btn');
    await page.waitForSelector('#logout_sidebar_link', { state: 'visible' });
    await page.click('#logout_sidebar_link');
    
    // Verify logged out
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });
});
