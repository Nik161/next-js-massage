import { test, expect, AUTH_FILE, hasCredentials, skipIntro } from "./fixtures";
import { deleteTestBooking } from "./helpers/db";
import type { Page } from "@playwright/test";

test.use({ storageState: AUTH_FILE });
test.skip(!hasCredentials, "E2E_USER_EMAIL / E2E_USER_PASSWORD are not set");

test.beforeEach(async ({ page }) => {
  await skipIntro(page);
});

// Goes through steps 1–2 and waits for the slots of the chosen day
async function openDateStep(page: Page) {
  await page.goto("/bookings/create");

  const step = page.locator("section").filter({ hasText: "Шаг 1 из 3" });
  await step.getByRole("button", { pressed: false }).first().click();
  await page.getByRole("button", { name: /Далее/ }).click();

  const programStep = page.locator("section").filter({ hasText: "Шаг 2 из 3" });
  await programStep.getByRole("button").first().click();
  await programStep.getByRole("button", { name: /60/ }).click();

  const slotsResponse = page.waitForResponse((r) =>
    r.url().includes("/api/massage_slots"),
  );
  await page.getByRole("button", { name: /Далее/ }).click();
  expect((await slotsResponse).status()).toBe(200);
}

test("lists bookings and searches by query", async ({ page }) => {
  await page.goto("/bookings");
  await expect(
    page.getByRole("heading", { name: /Ваши массажи/ }),
  ).toBeVisible();

  await page.getByPlaceholder(/Искать/).fill("2026");
  await expect(page).toHaveURL(/query=2026/);
  await expect(page).toHaveURL(/page=1/);
});

test("walks the booking wizard up to the slots", async ({ page }) => {
  await openDateStep(page);

  const slotsArea = page.locator("section").filter({ hasText: "Шаг 3 из 3" });
  await expect(slotsArea.getByText(/Не удалось загрузить/)).toHaveCount(0);

  const firstSlot = slotsArea
    .getByRole("button", { name: /^\d{2}:\d{2}$/ })
    .first();
  const submit = page.getByRole("button", { name: "Записаться" });

  if (await firstSlot.count()) {
    await expect(submit).toBeDisabled();
    await firstSlot.click();
    await expect(submit).toBeEnabled();
  } else {
    await expect(slotsArea.getByText(/свободных окон нет/)).toBeVisible();
  }
});

test("reloads slots when another day is picked", async ({ page }) => {
  await openDateStep(page);
  const days = page
    .locator("section")
    .filter({ hasText: "Шаг 3 из 3" })
    .getByRole("button", { pressed: false })
    .filter({ hasText: /^\D+\d+\D+$/ });

  const nextRequest = page.waitForRequest((r) =>
    r.url().includes("/api/massage_slots"),
  );
  await days.nth(2).click();
  expect((await nextRequest).url()).toMatch(/date=\d{4}-\d{2}-\d{2}/);
});

// Creates a real booking on the last bookable day and deletes it afterwards
test("creates a booking end to end", async ({ page }) => {
  test.skip(
    !process.env.E2E_ALLOW_WRITES,
    "set E2E_ALLOW_WRITES=1 to write to the database",
  );

  await openDateStep(page);
  const step = page.locator("section").filter({ hasText: "Шаг 3 из 3" });

  // The last day of the window is the least likely to collide with real clients
  const lastDayRequest = page.waitForResponse((r) =>
    r.url().includes("/api/massage_slots"),
  );
  await step.locator("div.snap-x > button").last().click();
  const response = await lastDayRequest;
  const date = new URL(response.url()).searchParams.get("date")!;
  const { slots } = (await response.json()) as { slots: string[] };
  test.skip(slots.length === 0, "no free slots on the last day");

  const time = slots.at(-1)!;
  await step.getByRole("button", { name: time, exact: true }).click();

  try {
    await page.getByRole("button", { name: "Записаться" }).click();
    await expect(page).toHaveURL(/\/bookings$/);

    await page.getByPlaceholder(/Искать/).fill(date);
    await expect(page.getByText(time).first()).toBeVisible();
  } finally {
    await deleteTestBooking(
      process.env.E2E_USER_EMAIL!,
      new Date(`${date}T${time}:00Z`),
    );
  }
});
