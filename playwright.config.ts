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
  testDir: 'src',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: 'html',
  use: { baseURL: baseUrl },

  // Opt out of parallel tests on CI.
  workers: process.env.CI ? 1 : undefined,

  // Each device must be in its own project
  projects: devicesToUse.map((deviceKey) => ({
    name: deviceKey as string,
    use: devices[deviceKey],
    testMatch: /.+\.e2e\.ts/,
  })),

  // Serve build to handle issues that may only appear in built environment
  // e.g. https://github.com/fast-reflexes/better-react-mathjax/issues/42
  webServer: {
    command:
      (!!process.env.CI ? 'npx playwright install-deps && ' : '') +
      'npm run serve-build',
    url: baseUrl,
    reuseExistingServer: !process.env.CI,
  },
});
