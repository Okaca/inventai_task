import { expect } from "@playwright/test";

/**
 * Page Object Model for Shopping Cart Page
 * Handles cart item verification and checkout navigation
 */
export class CartPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.cartItems = page.locator(".cart_item");
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator(
      '[data-test="continue-shopping"]',
    );
    this.cartItemName = page.locator(".inventory_item_name");
    this.cartItemPrice = page.locator(".inventory_item_price");
  }

  /**
   * Verify we're on the cart page
   */
  async verifyCartPage() {
    await expect(this.checkoutButton).toBeVisible();
  }

  /**
   * Verify a specific item is in the cart
   * @param {string} itemName - Name of the item to verify
   */
  async verifyItemInCart(itemName) {
    const items = await this.cartItemName.allTextContents();
    expect(items).toContain(itemName);
  }

  /**
   * Proceed to checkout
   */
  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  /**
   * Get the number of items in cart
   * @returns {Promise<number>} Number of items in cart
   */
  async getCartItemCount() {
    return await this.cartItems.count();
  }
}
