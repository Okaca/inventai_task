import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./src/ui_test", // ← Your UI tests go here!
  timeout: 30 * 1000,
  reporter: "list",
  use: {
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
