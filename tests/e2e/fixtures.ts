import { test as base, expect, type Page } from "@playwright/test";

export const AUTH_FILE = "tests/e2e/.auth/user.json";

export const hasCredentials = Boolean(
  process.env.E2E_USER_EMAIL && process.env.E2E_USER_PASSWORD,
);

// Marks the intro curtain as already seen, so tests start on the page itself
export async function skipIntro(page: Page) {
  await page.addInitScript(() => {
    sessionStorage.setItem("intro-seen", "1");
  });
}

type Fixtures = {
  // Console errors and uncaught exceptions collected during the test
  consoleErrors: string[];
};

export const test = base.extend<Fixtures>({
  consoleErrors: async ({ page }, provide) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));
    await provide(errors);
  },
});

export { expect };
