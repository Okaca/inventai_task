I used claude code for both taska

https://claude.ai/share/0c57477b-eab6-4e4b-8c25-bab96f58efbc

Here is the prompts and chat flow that I used for the first two tasks.
Also, this was the first time that I used claude code for coding and I must say I am amazed
how much and how far it could complete the required tasks.

For the second code, the only problem was comparing the screenshots and it was throwing an error if it
was different, the comparison was between the visual user and currently logged in useer as it was comparing the page,
which was still the visual user so I had to change it to comparison between standard user and visual user.

# InventAI Test Suite

A comprehensive testing framework featuring API testing (Jest + Supertest) and UI testing (Playwright) with Page Object Model design pattern.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Running Tests](#running-tests)
- [Test Suites](#test-suites)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This project contains two main test suites:

### 1. **API Testing** (Restful Booker API)

- Framework: Jest + Supertest
- Features:
  - AI-generated dynamic test data using Faker.js
  - JSON Schema validation (validates both data types and values)
  - Complete booking lifecycle testing (Create, Read, Update, Delete)
  - No hardcoded test data

### 2. **UI Testing** (Sauce Demo)

- Framework: Playwright
- Pattern: Page Object Model (POM)
- Features:
  - Standard e-commerce flow testing
  - Visual regression testing
  - AI-enhanced test architecture
  - Dynamic product selection

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)

Check your installations:

```bash
node --version
npm --version
git --version
```

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/Okaca/inventai_task.git
cd inventai_task
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Install Playwright Browsers

```bash
npx playwright install
```

This will download Chromium, Firefox, and WebKit browsers (~500MB).

**Optional**: Install only Chromium (faster):

```bash
npx playwright install chromium
```

### Step 4: Set Up Environment Variables

Create a `.env.test` file in the root directory:

```bash
# .env.test
BASE_URL=https://restful-booker.herokuapp.com
AUTH_USERNAME=admin
AUTH_PASSWORD=password123
```

---

## 📁 Project Structure

```
inventai_task/
├── src/
│   ├── tests/                      # API Tests (Jest)
│   │   └── restful_booker.spec.js
│   ├── ui_test/                    # UI Tests (Playwright)
│   │   └── saucedemo.spec.js
│   └── pages/                      # Page Objects (POM)
│       ├── LoginPage.js
│       ├── InventoryPage.js
│       ├── CartPage.js
│       └── CheckoutPage.js
├── screenshots/                    # Visual test screenshots
├── test_utils.js                   # API test utilities
├── schema_validator.js             # JSON schema validator
├── jest.config.js                  # Jest configuration
├── playwright.config.js            # Playwright configuration
├── package.json
└── .env.test                       # Environment variables
```

---

## 🧪 Running Tests

### Run All Tests

```bash
npm test
```

This runs both API and UI tests sequentially.

---

### API Tests Only

```bash
npm run test:api
```

**What it tests:**

- ✅ Authentication
- ✅ Create booking with AI-generated dynamic data
- ✅ Retrieve booking
- ✅ Update booking
- ✅ Delete booking
- ✅ JSON Schema validation (data types + values)

---

### UI Tests Only

```bash
npm run test:ui
```

**What it tests:**

- ✅ Standard e-commerce flow (login → add to cart → checkout)
- ✅ Visual regression testing (standard_user vs visual_user)

---

### Advanced Test Commands

#### Run specific test file

```bash
# API tests
npx jest src/tests/restful_booker.spec.js

# UI tests
npx playwright test src/ui_test/saucedemo.spec.js
```

#### Run UI tests in headed mode (see browser)

```bash
npx playwright test src/ui_test/saucedemo.spec.js --headed
```

#### Run UI tests in debug mode

```bash
npx playwright test src/ui_test/saucedemo.spec.js --debug
```

#### Run UI tests in interactive UI mode

```bash
npx playwright test src/ui_test/saucedemo.spec.js --ui
```

#### Run specific test by name

```bash
# Run only standard testing
npx playwright test src/ui_test/saucedemo.spec.js -g "Standard Testing"

# Run only visual testing
npx playwright test src/ui_test/saucedemo.spec.js -g "Visual Testing"
```

#### View Playwright test report

```bash
npx playwright show-report
```

---

## 📊 Test Suites

### API Testing - Restful Booker

**Endpoint:** `https://restful-booker.herokuapp.com`

**Test Flow:**

1. **Authentication** - Generate auth token
2. **Create Booking** - Create with AI-generated data (random names, dates, prices)
3. **Get Booking** - Retrieve and validate (both types and values)
4. **Update Booking** - Modify booking details
5. **Delete Booking** - Remove booking
6. **Verify Delete** - Confirm booking no longer exists

**Key Features:**

- ✨ AI-generated dynamic test data (no hardcoded values)
- ✨ JSON Schema validation validates both data types AND values
- ✨ Comprehensive validation using `validateBookingResponse()` function

**Example Output:**

```
📝 AI-Generated Test Data: {
  firstname: "Emma",
  lastname: "Johnson",
  totalprice: 287,
  depositpaid: true,
  bookingdates: {
    checkin: "2026-02-15",
    checkout: "2026-02-20"
  }
}

✅ All validations passed!
- Data type checks: ✓
- Value checks: ✓
```

---

### UI Testing - Sauce Demo

**Website:** `https://www.saucedemo.com`

#### Test 1: Standard E-commerce Flow

**Credentials:** `standard_user` / `secret_sauce`

**Test Steps:**

1. Login with standard_user
2. Find and add the most expensive item to cart (dynamic!)
3. Navigate to cart
4. Proceed to checkout
5. Fill checkout information
6. Complete purchase
7. Verify "Thank you for your order!" message

**Key Features:**

- ✨ Dynamic product selection (automatically finds most expensive)
- ✨ Page Object Model architecture
- ✨ Comprehensive logging

---

#### Test 2: Visual Regression Testing

**Credentials:**

- Standard: `standard_user` / `secret_sauce`
- Visual: `visual_user` / `secret_sauce`

**Test Steps:**

1. Login as standard_user, capture screenshot
2. Login as visual_user, capture screenshot
3. Compare screenshots
4. Document visual differences

**Screenshots saved in:**

- `screenshots/standard_user_home.png`
- `screenshots/visual_user_home.png`

**Note:** Visual differences are expected - `visual_user` has intentional UI bugs for testing purposes.

---

## ⚙️ Configuration

### Jest Configuration (`jest.config.js`)

```javascript
export default {
  testEnvironment: "node",
  transform: {},
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testMatch: ["**/src/tests/**/*.spec.js"],
};
```

### Playwright Configuration (`playwright.config.js`)

```javascript
export default defineConfig({
  testDir: "./src/ui_test",
  timeout: 30 * 1000,
  reporter: "html",
  use: {
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [{ name: "chromium" }],
});
```

---

## 🐛 Troubleshooting

### Issue: `Cannot use import statement outside a module`

**Solution:**

1. Ensure `"type": "module"` is in `package.json`
2. Update test script in `package.json`:
   ```json
   "test:api": "node --experimental-vm-modules node_modules/jest/bin/jest.js"
   ```

---

### Issue: `defineConfig is not defined` (Playwright)

**Solution:**

```bash
npm install --save-dev @playwright/test
npx playwright install
```

---

### Issue: Tests timeout or fail

**For API Tests:**

- Check if `https://restful-booker.herokuapp.com` is accessible
- Verify `.env.test` file exists with correct credentials

**For UI Tests:**

- Ensure browsers are installed: `npx playwright install`
- Check internet connection
- Try running in headed mode to see what's happening: `--headed`

---

### Issue: Visual tests show differences

**Expected Behavior:**
Visual differences between `standard_user` and `visual_user` are expected. The `visual_user` account has intentional UI bugs for testing purposes.

---

### Issue: Import path errors

**Solution:**
Verify file structure matches the project structure above. Import paths should be:

- From test file to utils: `../../test_utils.js`
- From test file to pages: `../pages/LoginPage.js`

---

## 🤖 AI Assistance

This test suite was created with AI assistance (Claude by Anthropic) to demonstrate:

- ✅ AI-enhanced test architecture
- ✅ Dynamic test data generation
- ✅ Page Object Model implementation
- ✅ Comprehensive documentation
- ✅ Best practices and code quality

**AI Improvements:**

1. Structured POM architecture
2. Dynamic product selection logic
3. Comprehensive JSON schema validation
4. Visual regression testing strategy
5. Detailed JSDoc documentation

---

## 📝 Environment Variables

Required environment variables in `.env.test`:

| Variable        | Description                 | Example                                |
| --------------- | --------------------------- | -------------------------------------- |
| `BASE_URL`      | Restful Booker API base URL | `https://restful-booker.herokuapp.com` |
| `AUTH_USERNAME` | API authentication username | `admin`                                |
| `AUTH_PASSWORD` | API authentication password | `password123`                          |

---

## 🎓 Learning Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Playwright Documentation](https://playwright.dev/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Faker.js Documentation](https://fakerjs.dev/)

---

## 📄 License

This project is for educational and demonstration purposes.

---

## 🙋‍♂️ Support

If you encounter any issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Verify all prerequisites are installed
3. Ensure environment variables are set correctly
4. Check that all dependencies are installed: `npm install`

---

## 🎯 Test Credentials

### Sauce Demo (UI Tests)

| User Type     | Username        | Password       | Purpose             |
| ------------- | --------------- | -------------- | ------------------- |
| Standard User | `standard_user` | `secret_sauce` | Normal flow testing |
| Visual User   | `visual_user`   | `secret_sauce` | Visual bug testing  |

### Restful Booker (API Tests)

| Field         | Value                                  |
| ------------- | -------------------------------------- |
| Base URL      | `https://restful-booker.herokuapp.com` |
| Auth Username | `admin`                                |
| Auth Password | `password123`                          |

---

**Created with ❤️ and AI assistance**
