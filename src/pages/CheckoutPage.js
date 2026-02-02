import { expect } from "@playwright/test";

/**
 * Page Object Model for Checkout Pages
 * Handles checkout information, overview, and completion
 */
export class CheckoutPage {
  constructor(page) {
    this.page = page;

    // Checkout Step 1: Your Information
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');

    // Checkout Step 2: Overview
    this.finishButton = page.locator('[data-test="finish"]');
    this.summaryTotal = page.locator(".summary_total_label");

    // Checkout Complete
    this.completeHeader = page.locator(".complete-header");
    this.completeText = page.locator(".complete-text");
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  /**
   * Fill checkout information form
   * @param {string} firstName - First name
   * @param {string} lastName - Last name
   * @param {string} postalCode - Postal/ZIP code
   */
  async fillCheckoutInformation(firstName, lastName, postalCode) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  /**
   * Complete the checkout process
   */
  async finishCheckout() {
    await this.finishButton.click();
  }

  /**
   * Verify the order completion message
   * @param {string} expectedMessage - Expected success message
   */
  async verifyOrderComplete(expectedMessage = "Thank you for your order!") {
    await expect(this.completeHeader).toBeVisible();
    await expect(this.completeHeader).toHaveText(expectedMessage);
  }

  /**
   * Verify we're on checkout overview page
   */
  async verifyCheckoutOverview() {
    await expect(this.finishButton).toBeVisible();
    await expect(this.summaryTotal).toBeVisible();
  }

  /**
   * Get the complete order confirmation text
   * @returns {Promise<string>} Complete confirmation message
   */
  async getOrderConfirmationText() {
    return await this.completeHeader.textContent();
  }
}
