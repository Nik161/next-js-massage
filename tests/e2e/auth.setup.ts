import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { test as setup, expect } from "@playwright/test";
import { AUTH_FILE, hasCredentials } from "./fixtures";

// Signs in once and stores the session for tests that need a user.
setup("authenticate", async ({ page }) => {
  mkdirSync(dirname(AUTH_FILE), { recursive: true });

  if (!hasCredentials) {
    writeFileSync(AUTH_FILE, JSON.stringify({ cookies: [], origins: [] }));
    setup.skip(true, "E2E_USER_EMAIL / E2E_USER_PASSWORD are not set");
    return;
  }

  await page.goto("/login");
  await page.getByLabel("Email").fill(process.env.E2E_USER_EMAIL!);
  await page.getByLabel("Пароль").fill(process.env.E2E_USER_PASSWORD!);
  await page.getByRole("button", { name: "Войти" }).click();

  await expect(page).toHaveURL(/\/bookings/);
  await page.context().storageState({ path: AUTH_FILE });
});
