import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3100);
const BASE_URL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;

// The suite runs against the database from .env. Booking creation is opt-in
// (E2E_ALLOW_WRITES=1), see tests/e2e/booking.spec.ts.
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: BASE_URL,
    locale: "ru-RU",
    timezoneId: "America/Sao_Paulo",
    // Uses the locally installed Chrome; run `npx playwright install chromium`
    // and remove `channel` to use Playwright's own browser instead.
    channel: "chrome",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "setup", testMatch: /auth\.setup\.ts/ },
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], channel: "chrome" },
      dependencies: ["setup"],
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"], channel: "chrome" },
      dependencies: ["setup"],
    },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        // Calls next directly: the pnpm in node_modules/.bin needs a newer Node
        command: `npx next build && npx next start -p ${PORT}`,
        url: `${BASE_URL}/login`,
        reuseExistingServer: !process.env.CI,
        timeout: 300_000,
        // Auth.js only trusts the host automatically on Vercel
        env: { AUTH_TRUST_HOST: "true" },
      },
});
