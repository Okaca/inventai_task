import { expect } from "@playwright/test";

/**
 * Page Object Model for Inventory/Products Page
 * Handles product listing, filtering, and cart operations
 */
export class InventoryPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.inventoryContainer = page.locator(".inventory_container");
    this.inventoryItems = page.locator(".inventory_item");
    this.cartBadge = page.locator(".shopping_cart_badge");
    this.cartIcon = page.locator(".shopping_cart_link");
    this.productSortDropdown = page.locator(
      '[data-test="product-sort-container"]',
    );
  }

  /**
   * Verify we're on the inventory page
   */
  async verifyInventoryPage() {
    await expect(this.inventoryContainer).toBeVisible();
  }

  /**
   * Get all product items with their prices
   * @returns {Promise<Array>} Array of products with name and price
   */
  async getAllProducts() {
    const products = [];
    const items = await this.inventoryItems.all();

    for (const item of items) {
      const name = await item.locator(".inventory_item_name").textContent();
      const priceText = await item
        .locator(".inventory_item_price")
        .textContent();
      const price = parseFloat(priceText.replace("$", ""));

      products.push({
        name: name.trim(),
        price: price,
        element: item,
      });
    }

    return products;
  }

  /**
   * Find and add the most expensive item to cart
   * @returns {Promise<Object>} The most expensive product object
   */
  async addMostExpensiveItemToCart() {
    const products = await this.getAllProducts();

    // Find the most expensive product
    const mostExpensive = products.reduce((max, product) =>
      product.price > max.price ? product : max,
    );

    console.log(
      `Most expensive item: ${mostExpensive.name} - $${mostExpensive.price}`,
    );

    // Click the "Add to cart" button for this product
    await mostExpensive.element.locator('[data-test^="add-to-cart"]').click();

    return mostExpensive;
  }

  /**
   * Navigate to shopping cart
   */
  async goToCart() {
    await this.cartIcon.click();
  }

  /**
   * Verify cart badge shows correct number of items
   * @param {number} expectedCount - Expected number of items in cart
   */
  async verifyCartBadgeCount(expectedCount) {
    await expect(this.cartBadge).toHaveText(expectedCount.toString());
  }

  /**
   * Take a screenshot of the inventory page for visual comparison
   * @param {string} filename - Name for the screenshot file
   */
  async takeScreenshot(filename) {
    await this.page.screenshot({
      path: `screenshots/${filename}`,
      fullPage: true,
    });
  }
}
