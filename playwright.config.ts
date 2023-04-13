import { defineConfig, devices } from '@playwright/test';

const devicesToUse: (keyof typeof devices)[] = [
  'Desktop Chrome',
  'Desktop Edge',
  'Desktop Firefox',
  'Desktop Safari',
  'iPhone X',
  'Pixel 2',
];

const baseUrl = 'http://localhost:3000';

export default defineConfig({
  // Look for test files in the "tests" directory, relative to this configuration file.
  testDir: 'src',

  // Run all tests in parallel.
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,

  // Opt out of parallel tests on CI.
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: 'html',

  use: {
    // Base URL to use in actions like `await page.goto('/')`.
    baseURL: baseUrl,
  },

  projects: devicesToUse.map((deviceKey) => ({
    name: deviceKey as string,
    use: { ...devices[deviceKey] },
    testMatch: /.+\.e2e\.ts/,
  })),

  // Run your local dev server before starting the tests.
  webServer: {
    // Serve build to handle issues that may only appear in built environment
    // e.g. https://github.com/fast-reflexes/better-react-mathjax/issues/42
    command: 'npm run serve-build',
    url: baseUrl,
    reuseExistingServer: !process.env.CI,
  },
});
