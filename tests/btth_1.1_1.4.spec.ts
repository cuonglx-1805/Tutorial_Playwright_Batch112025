import { test, expect } from '@playwright/test';
import type { Page } from 'playwright';

// Helper function to generate unique username
function generateUniqueUsername(): string {
  const timestamp = Date.now();
  return `testuser_${timestamp}`;
}

// Helper function to navigate to register page
async function navigateToRegister(page: Page) {
  await page.goto('https://www.globalsqa.com/angularJs-protractor/registration-login-example/#/register');
  // Wait for Angular to load
  await page.waitForLoadState('networkidle');
}

// Helper function to navigate to login page
async function navigateToLogin(page: Page) {
  await page.goto('https://www.globalsqa.com/angularJs-protractor/registration-login-example/#/login');
  await page.waitForLoadState('networkidle');
}

test.describe('GlobalSQA Registration and Login Tests', () => {
  test('should verify Register page title is displayed correctly', async ({ page }) => {
    // Navigate to register page
    await navigateToRegister(page);
    
    // Verify page heading displays "Register"
    const pageHeading = page.locator('h2');
    await expect(pageHeading).toBeVisible();
    await expect(pageHeading).toHaveText('Register');
  });

  test('should verify all input fields are displayed on Register page', async ({ page }) => {
    // Navigate to register page
    await navigateToRegister(page);
    
    // Verify First Name input is visible
    const firstNameInput = page.locator('input[name="firstName"]');
    await expect(firstNameInput).toBeVisible();
    
    // Verify Last Name input is visible
    const lastNameInput = page.locator('input[name="lastName"]');
    await expect(lastNameInput).toBeVisible();
    
    // Verify Username input is visible
    const usernameInput = page.locator('input[name="username"]');
    await expect(usernameInput).toBeVisible();
    
    // Verify Password input is visible
    const passwordInput = page.locator('input[name="password"]');
    await expect(passwordInput).toBeVisible();
    
    // Verify Register button is visible
    const registerButton = page.locator('button.btn-primary');
    await expect(registerButton).toBeVisible();
    await expect(registerButton).toHaveText('Register');
  });

  test('should fill in registration form and submit', async ({ page }) => {
    // Navigate to register page
    await navigateToRegister(page);
    
    const testData = {
      firstName: 'Cuong',
      lastName: 'Luong',
      username: generateUniqueUsername(),
      password: 'Password123!'
    };
    
    // Fill First Name using ID
    await page.fill('#firstName', testData.firstName);
    
    // Fill Last Name using ID (id="Text1" in HTML)
    await page.fill('#Text1', testData.lastName);
    
    // Fill Username using ID
    await page.fill('#username', testData.username);
    
    // Fill Password using ID
    await page.fill('#password', testData.password);
    
    // Click Register button
    await page.click('button[type="submit"]');
    
    // Wait for success message or redirect
    await page.waitForTimeout(2000);
    
    // Verify success message or redirect to login page
    const successMessage = page.locator('.alert-success');
    const loginHeading = page.locator('h2:has-text("Login")');
    
    // Either success message appears or we're redirected to login
    const isSuccess = await successMessage.isVisible().catch(() => false);
    const isLoginPage = await loginHeading.isVisible().catch(() => false);
    
    expect(isSuccess || isLoginPage).toBeTruthy();
  });

  test('should register successfully and login with new account', async ({ page }) => {
    // Generate unique user data
    const testData = {
      firstName: 'Test',
      lastName: 'User',
      username: generateUniqueUsername(),
      password: 'SecurePass123!'
    };
    
    // STEP 1: Register new account
    await navigateToRegister(page);
    
    // Fill registration form using IDs from HTML
    await page.fill('#firstName', testData.firstName);
    await page.fill('#Text1', testData.lastName); // Last name has id="Text1"
    await page.fill('#username', testData.username);
    await page.fill('#password', testData.password);
    
    // Wait for button to be enabled (AngularJS validation)
    await page.waitForTimeout(500);
    
    // Submit registration
    await page.click('button[type="submit"]');
    
    // Wait for registration to complete and check for success message
    await page.waitForTimeout(2000);
    
    // STEP 2: Should be redirected to login page or manually navigate
    // Check if already on login page
    const currentUrl = page.url();
    if (!currentUrl.includes('#/login')) {
      await navigateToLogin(page);
    }
    
    // Verify we're on login page
    await page.waitForSelector('h2', { state: 'visible' });
    const loginHeading = page.locator('h2');
    await expect(loginHeading).toHaveText('Login');
    
    // STEP 3: Login with newly created account
    await page.fill('#username', testData.username);
    await page.fill('#password', testData.password);
    
    // Click Login button
    await page.click('button[type="submit"]');
    
    // Wait for login to complete
    await page.waitForTimeout(2000);
    
    // STEP 4: Verify successful login
    // After successful login, URL should change from #/login
    const urlAfterLogin = page.url();
    expect(urlAfterLogin).not.toContain('#/login');
    
    // Should be on home page (# or #/)
    expect(urlAfterLogin).toMatch(/#\/?$/);
    
    // Verify we're logged in by checking for user-specific content or logout link
    const pageContent = await page.content();
    const hasUserContent = pageContent.includes(testData.firstName) || 
                          pageContent.includes('Logout') || 
                          pageContent.includes('Hi ');
    
    expect(hasUserContent).toBeTruthy();
  });

  test('should verify input field validation', async ({ page }) => {
    await navigateToRegister(page);
    
    // Try to submit empty form - button should be disabled
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeDisabled();
    
    // Verify we're still on register page
    const pageHeading = page.locator('h2');
    await expect(pageHeading).toHaveText('Register');
    
    // Fill only firstName and verify button still disabled
    await page.fill('#firstName', 'Test');
    await expect(submitButton).toBeDisabled();
  });

  test('should verify Cancel button navigates to login page', async ({ page }) => {
    await navigateToRegister(page);
    
    // Find and click Cancel button
    const cancelButton = page.locator('a:has-text("Cancel")');
    await expect(cancelButton).toBeVisible();
    await cancelButton.click();
    
    // Wait for navigation
    await page.waitForTimeout(1000);
    
    // Verify we're on login page
    const loginHeading = page.locator('h2');
    await expect(loginHeading).toHaveText('Login');
  });

  test('should complete full registration flow with all validations', async ({ page }) => {
    const userData = {
      firstName: 'Playwright',
      lastName: 'Automation',
      username: generateUniqueUsername(),
      password: 'TestPass123!'
    };
    
    // Navigate to register page
    await navigateToRegister(page);
    
    // Verify page title
    await expect(page.locator('h2')).toHaveText('Register');
    
    // Verify all inputs are visible and editable using IDs from HTML
    await expect(page.locator('#firstName')).toBeVisible();
    await expect(page.locator('#firstName')).toBeEditable();
    
    await expect(page.locator('#Text1')).toBeVisible(); // Last name
    await expect(page.locator('#Text1')).toBeEditable();
    
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#username')).toBeEditable();
    
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#password')).toBeEditable();
    await expect(page.locator('#password')).toHaveAttribute('type', 'password');
    
    // Fill all fields using IDs
    await page.fill('#firstName', userData.firstName);
    await expect(page.locator('#firstName')).toHaveValue(userData.firstName);
    
    await page.fill('#Text1', userData.lastName);
    await expect(page.locator('#Text1')).toHaveValue(userData.lastName);
    
    await page.fill('#username', userData.username);
    await expect(page.locator('#username')).toHaveValue(userData.username);
    
    await page.fill('#password', userData.password);
    await expect(page.locator('#password')).toHaveValue(userData.password);
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for response
    await page.waitForTimeout(2000);
    
    // Login with new account
    await navigateToLogin(page);
    await page.fill('#username', userData.username);
    await page.fill('#password', userData.password);
    await page.click('button[type="submit"]');
    
    // Verify login successful
    await page.waitForTimeout(2000);
    const urlAfterLogin = page.url();
    expect(urlAfterLogin).not.toContain('#/login');
  });
});
