import { defineConfig, devices } from "@playwright/test";

// E2E runs against a separate production build in .e2e-out (out/ is left for deployment builds).

export default defineConfig({
  testDir: "tests",
  timeout: 45_000,
  fullyParallel: true,
  reporter: [["list"]],
  use: { baseURL: "http://localhost:4174" },
  webServer: {
    command: "npx next build && rm -rf .e2e-out && mv out .e2e-out && ROOT=.e2e-out PORT=4174 node scripts/serve.mjs",
    url: "http://localhost:4174",
    timeout: 240_000,
    reuseExistingServer: false,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"], viewport: { width: 390, height: 844 } } },
  ],
});
