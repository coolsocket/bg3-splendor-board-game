import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'npx vite --port 5175',
    url: 'http://localhost:5175',
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
  use: {
    baseURL: 'http://localhost:5175',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
