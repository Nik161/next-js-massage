import { test, expect } from "./fixtures";

test.describe("access control", () => {
  for (const path of [
    "/bookings",
    "/bookings/create",
    "/bookings/00000000-0000-4000-8000-000000000000/edit",
  ]) {
    test(`redirects guests from ${path} to login`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveURL(/\/login\?.*callbackUrl=/);
    });
  }

  test("the slots API rejects guests", async ({ request }) => {
    const response = await request.get(
      "/api/massage_slots?therapistId=e67190e7-db41-4612-9963-6ada87745747&date=2026-10-20&duration=60",
    );
    expect(response.status()).toBe(401);
  });
});

test.describe("login", () => {
  test("rejects wrong credentials", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("e2e-nobody@example.com");
    await page.getByLabel("Пароль").fill("wrong-password");
    await page.getByRole("button", { name: "Войти" }).click();

    await expect(page.getByText("Invalid credentials.")).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test("validates the form in the browser", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: "Войти" }).click();
    const isValid = await page
      .getByLabel("Email")
      .evaluate((input: HTMLInputElement) => input.validity.valid);
    expect(isValid).toBe(false);
  });
});

test("unknown pages show the 404 screen", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByText("Не смогли найти страницу")).toBeVisible();
  await page.getByRole("link", { name: /Вернуться на главную/ }).click();
  await expect(page).toHaveURL(/\/$/);
});
