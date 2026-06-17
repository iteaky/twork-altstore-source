import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 45_000,
  expect: { timeout: 8_000 },
  fullyParallel: false,
  retries: 0,
  reporter: process.env.CI
    ? [['line'], ['html', { outputFolder: 'playwright-report', open: 'never' }]]
    : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'off',
    screenshot: 'only-on-failure',
    video: 'off'
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'webkit-iphone',
      use: { ...devices['iPhone 13'] }
    }
  ],
  webServer: {
    command: 'python3 -m http.server 4173 --bind 127.0.0.1',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 20_000
  }
});
