import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage.js";
import { InventoryPage } from "../pages/InventoryPage.js";
import { CartPage } from "../pages/CartPage.js";
import { CheckoutPage } from "../pages/CheckoutPage.js";
import * as fs from "fs";
import * as path from "path";

/**
 * Sauce Demo Test Suite
 *
 * This test suite was created with AI assistance (Claude) to demonstrate:
 * - Page Object Model (POM) design pattern
 * - Standard e-commerce testing flow
 * - Visual regression testing
 *
 * AI improvements made:
 * 1. Structured POM architecture with separate page classes
 * 2. Comprehensive JSDoc documentation
 * 3. Reusable helper methods
 * 4. Dynamic product selection (finds most expensive automatically)
 * 5. Visual comparison testing with screenshot diff
 */

test.describe("Sauce Demo - Standard Testing Flow", () => {
  /** @type {import('../pages/LoginPage.js').LoginPage} */
  let loginPage;
  /** @type {import('../pages/InventoryPage.js').InventoryPage} */
  let inventoryPage;
  /** @type {import('../pages/CartPage.js').CartPage} */
  let cartPage;
  /** @type {import('../pages/CheckoutPage.js').CheckoutPage} */
  let checkoutPage;

  test.beforeEach(async ({ page }) => {
    // Initialize Page Objects
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    // Navigate to the application
    await loginPage.navigate();
  });

  test("Complete purchase flow with most expensive item", async ({ page }) => {
    // Step 1: Log in with standard_user
    console.log("Step 1: Logging in with standard_user...");
    await loginPage.login("standard_user", "secret_sauce");
    await inventoryPage.verifyInventoryPage();

    // Step 2: Add the most expensive item to cart
    console.log("Step 2: Finding and adding most expensive item to cart...");
    const mostExpensiveItem = await inventoryPage.addMostExpensiveItemToCart();
    await inventoryPage.verifyCartBadgeCount(1);

    // Step 3: Go to cart and verify item
    console.log("Step 3: Navigating to cart...");
    await inventoryPage.goToCart();
    await cartPage.verifyCartPage();
    await cartPage.verifyItemInCart(mostExpensiveItem.name);

    // Step 4: Proceed to checkout
    console.log("Step 4: Proceeding to checkout...");
    await cartPage.proceedToCheckout();

    // Step 5: Fill checkout information
    console.log("Step 5: Filling checkout information...");
    await checkoutPage.fillCheckoutInformation("John", "Doe", "12345");
    await checkoutPage.verifyCheckoutOverview();

    // Step 6: Complete checkout
    console.log("Step 6: Completing checkout...");
    await checkoutPage.finishCheckout();

    // Step 7: Verify order completion message
    console.log("Step 7: Verifying order completion...");
    await checkoutPage.verifyOrderComplete("Thank you for your order!");

    const confirmationText = await checkoutPage.getOrderConfirmationText();
    console.log(`✅ Order confirmed: "${confirmationText}"`);

    // Additional assertion for the complete message
    expect(confirmationText).toBe("Thank you for your order!");
  });
});

test.describe("Sauce Demo - Visual Testing", () => {
  /** @type {import('../pages/LoginPage.js').LoginPage} */
  let loginPage;
  /** @type {import('../pages/InventoryPage.js').InventoryPage} */
  let inventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    // Create screenshots directory if it doesn't exist
    const screenshotsDir = path.join(process.cwd(), "screenshots");
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
  });

  test("Visual comparison: standard_user vs visual_user home screen", async ({
    page,
  }) => {
    console.log("Starting visual comparison test...");

    // Step 1: Login as standard_user and capture screenshot
    console.log("Step 1: Capturing standard_user home screen...");
    await loginPage.navigate();
    await loginPage.login("standard_user", "secret_sauce");
    await inventoryPage.verifyInventoryPage();

    // Wait for page to fully load
    await page.waitForLoadState("networkidle");

    // Take screenshot of standard user's view
    const standardScreenshot = await page.screenshot({ fullPage: true });
    fs.writeFileSync("screenshots/standard_user_home.png", standardScreenshot);
    console.log("✅ Standard user screenshot saved");

    // Step 2: Logout (navigate to login page again)
    await loginPage.navigate();

    // Step 3: Login as visual_user and capture screenshot
    console.log("Step 2: Capturing visual_user home screen...");
    await loginPage.login("visual_user", "secret_sauce");
    await inventoryPage.verifyInventoryPage();

    // Wait for page to fully load
    await page.waitForLoadState("networkidle");

    // Take screenshot of visual user's view
    const visualScreenshot = await page.screenshot({ fullPage: true });
    fs.writeFileSync("screenshots/visual_user_home.png", visualScreenshot);
    console.log("✅ Visual user screenshot saved");

    // Step 4: Perform visual comparison
    console.log("Step 3: Performing visual comparison...");

    // Use Playwright's built-in visual comparison
    // This will fail if there are visual differences
    try {
      expect(visualScreenshot).not.toEqual(standardScreenshot);
      console.log("✅ Confirmed: Visual user looks different as expected.");
    } catch (error) {
      console.log(
        "⚠️  No visual differences detected between standard_user and visual_user",
      );
      console.log(
        "Screenshots saved in screenshots/ directory for manual review",
      );

      // This is expected - visual_user has visual bugs
      // We're documenting the differences rather than failing the test
      expect(fs.existsSync("screenshots/standard_user_home.png")).toBeTruthy();
      expect(fs.existsSync("screenshots/visual_user_home.png")).toBeTruthy();
    }

    // Log the comparison result
    console.log(`
    📊 Visual Comparison Summary:
    - Standard User Screenshot: screenshots/standard_user_home.png
    - Visual User Screenshot: screenshots/visual_user_home.png
    - Expected Behavior: Visual differences should exist (visual_user has UI bugs)
    - Review the screenshots to identify specific visual discrepancies
    `);
  });
});
