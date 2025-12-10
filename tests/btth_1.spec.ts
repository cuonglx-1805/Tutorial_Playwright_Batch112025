import { test, expect } from '@playwright/test';
import type { Locator, Page } from 'playwright';

export const getElementById = (page: Page, id: string): Locator =>
  page.locator(`#${id}`);

export const getElementByXPath = (page: Page, xpath: string): Locator =>
  page.locator(`xpath=${xpath}`);

test.describe('User Registration Tests', () => {
  test('should register a new user successfully', async ({ page }) => {
    // Navigate to registration page
    await page.goto('https://material.playwrightvn.com/01-xpath-register-page.html');

    // Fill Username
    const usernameInput = getElementById(page, 'username');
    await usernameInput.fill('cuonglx1805');
    await expect(usernameInput).toHaveValue('cuonglx1805');

    // Fill Email
    const emailInput = getElementById(page, 'email');
    await emailInput.fill('cuonglx@example.com');
    await expect(emailInput).toHaveValue('cuonglx@example.com');

    // Select Gender (Radio button)
    const genderMale = getElementById(page, 'male');
    await genderMale.check();
    await expect(genderMale).toBeChecked();

    // Select Hobbies (Checkboxes) - Correct IDs: reading, traveling, cooking
    const hobbyReading = getElementById(page, 'reading');
    const hobbyTraveling = getElementById(page, 'traveling');
    
    await hobbyReading.check();
    await hobbyTraveling.check();
    
    // Verify hobbies are checked
    await expect(hobbyReading).toBeChecked();
    await expect(hobbyTraveling).toBeChecked();

    // Select Interests (Dropdown - multiple select)
    const interestsDropdown = getElementById(page, 'interests');
    await interestsDropdown.selectOption(['technology', 'music']);

    // Select Country (Dropdown)
    const countryDropdown = getElementById(page, 'country');
    await countryDropdown.selectOption('usa');
    await expect(countryDropdown).toHaveValue('usa');

    // Fill Date of Birth
    const dobInput = getElementById(page, 'dob');
    await dobInput.fill('1990-05-15');
    await expect(dobInput).toHaveValue('1990-05-15');

    // Click Register button
    const registerButton = page.locator('button[type="submit"]');
    await registerButton.click();

    // Verify user appears in the table
    const userTable = page.locator('table tbody');
    await expect(userTable.locator('text=cuonglx1805')).toBeVisible();
    await expect(userTable.locator('text=cuonglx@example.com')).toBeVisible();
  });

  test('should verify gender radio button selection', async ({ page }) => {
    await page.goto('https://material.playwrightvn.com/01-xpath-register-page.html');

    const genderMale = getElementById(page, 'male');
    const genderFemale = getElementById(page, 'female');

    // Test Male selection
    await genderMale.check();
    await expect(genderMale).toBeChecked();
    await expect(genderFemale).not.toBeChecked();

    // Test Female selection
    await genderFemale.check();
    await expect(genderFemale).toBeChecked();
    await expect(genderMale).not.toBeChecked();
  });

  test('should verify hobbies checkbox selection', async ({ page }) => {
    await page.goto('https://material.playwrightvn.com/01-xpath-register-page.html');

    // Correct hobby IDs from HTML: reading, traveling, cooking
    const hobbyReading = getElementById(page, 'reading');
    const hobbyTraveling = getElementById(page, 'traveling');
    const hobbyCooking = getElementById(page, 'cooking');

    // Initially all should be unchecked
    await expect(hobbyReading).not.toBeChecked();
    await expect(hobbyTraveling).not.toBeChecked();
    await expect(hobbyCooking).not.toBeChecked();

    // Check multiple hobbies
    await hobbyReading.check();
    await hobbyTraveling.check();
    
    await expect(hobbyReading).toBeChecked();
    await expect(hobbyTraveling).toBeChecked();
    await expect(hobbyCooking).not.toBeChecked();

    // Uncheck one hobby
    await hobbyReading.uncheck();
    await expect(hobbyReading).not.toBeChecked();
    await expect(hobbyTraveling).toBeChecked();
  });

  test('should register user with all fields filled', async ({ page }) => {
    await page.goto('https://material.playwrightvn.com/01-xpath-register-page.html');

    // Fill all required fields
    await getElementById(page, 'username').fill('testuser123');
    await getElementById(page, 'email').fill('testuser@test.com');
    
    // Select gender
    await getElementById(page, 'female').check();
    await expect(getElementById(page, 'female')).toBeChecked();
    
    // Select hobbies - using correct IDs
    await getElementById(page, 'reading').check();
    await getElementById(page, 'cooking').check();
    await expect(getElementById(page, 'reading')).toBeChecked();
    await expect(getElementById(page, 'cooking')).toBeChecked();
    
    // Select interests (multiple)
    await getElementById(page, 'interests').selectOption(['music', 'sports']);
    
    // Select country
    await getElementById(page, 'country').selectOption('canada');
    
    // Fill date of birth
    await getElementById(page, 'dob').fill('1995-12-25');
    
    // Submit form
    await page.locator('button[type="submit"]').click();
    
    // Verify registration success - check table for new user
    const tableBody = page.locator('table tbody');
    await expect(tableBody.locator('text=testuser123')).toBeVisible();
    await expect(tableBody.locator('text=testuser@test.com')).toBeVisible();
  });

  test('should verify all form fields before registration', async ({ page }) => {
    await page.goto('https://material.playwrightvn.com/01-xpath-register-page.html');

    const username = 'playwright_user';
    const email = 'playwright@vn.com';

    // Fill username and email
    await getElementById(page, 'username').fill(username);
    await getElementById(page, 'email').fill(email);

    // Select and verify gender
    const genderRadio = getElementById(page, 'male');
    await genderRadio.check();
    await expect(genderRadio).toBeChecked();

    // Select and verify multiple hobbies - using correct IDs
    const reading = getElementById(page, 'reading');
    const traveling = getElementById(page, 'traveling');
    await reading.check();
    await traveling.check();
    await expect(reading).toBeChecked();
    await expect(traveling).toBeChecked();

    // Select interests (multiple select)
    const interests = getElementById(page, 'interests');
    await interests.selectOption(['art', 'technology']);

    // Select country
    const country = getElementById(page, 'country');
    await country.selectOption('usa');
    await expect(country).toHaveValue('usa');

    // Fill date of birth
    const dob = getElementById(page, 'dob');
    await dob.fill('2000-01-01');
    await expect(dob).toHaveValue('2000-01-01');

    // Click register
    await page.locator('button[type="submit"]').click();

    // Verify user in table
    await expect(page.locator(`table tbody >> text=${username}`)).toBeVisible();
  });
});
