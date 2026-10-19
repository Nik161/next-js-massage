import { test, expect, skipIntro } from "./fixtures";

const SECTIONS = ["top", "about", "rituals", "masters", "gallery", "contacts"];

test.describe("intro curtain", () => {
  test("plays on the first visit, then reveals the page", async ({ page }) => {
    await page.goto("/");
    const intro = page.locator(".intro");

    await expect(intro).toBeVisible();
    await expect(intro).toHaveCount(0, { timeout: 6_000 });
    await expect(
      page.getByRole("heading", { level: 1, name: /Твоё тело/ }),
    ).toBeVisible();
    // Scrolling is unlocked again
    await expect(page.locator("html")).not.toHaveAttribute("style", /overflow/);
  });

  test("is skipped on a repeat visit in the same session", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".intro")).toHaveCount(0, { timeout: 6_000 });

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-intro-seen", "");
    await expect(page.locator(".intro")).toBeHidden();
  });
});

test.describe("landing page", () => {
  test.beforeEach(async ({ page }) => {
    await skipIntro(page);
    await page.goto("/");
  });

  test("renders every section", async ({ page }) => {
    for (const id of SECTIONS) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
    await expect(page).toHaveTitle("Niko Massage");
  });

  test("reveals content while scrolling", async ({ page }) => {
    const heading = page.locator("#masters h2");
    await heading.scrollIntoViewIfNeeded();
    await expect(heading.locator("xpath=..")).toHaveAttribute(
      "data-visible",
      "true",
    );
    await expect(page.getByText("доверяют")).toBeVisible();
  });

  test("shows therapists from the database with a preselecting link", async ({
    page,
  }) => {
    const links = page.getByRole("link", { name: /Записаться к мастеру/ });
    await expect(links.first()).toBeAttached();
    await expect(links.first()).toHaveAttribute(
      "href",
      /^\/bookings\/create\?therapist=[0-9a-f-]{36}$/,
    );
  });

  test("sends guests to the login page from the booking CTA", async ({
    page,
  }) => {
    await page
      .getByRole("link", { name: "Записаться на сеанс" })
      .first()
      .click();
    await expect(page).toHaveURL(/\/login\?.*callbackUrl=.*bookings%2Fcreate/);
  });

  test("has no horizontal overflow and no console errors", async ({
    page,
    consoleErrors,
  }) => {
    // Scroll through the whole page so every lazy part renders
    const height = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < height; y += 600) {
      await page.mouse.wheel(0, 600);
    }
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
    expect(consoleErrors).toEqual([]);
  });

  test("respects reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload();
    // The sticky horizontal gallery falls back to a normal block
    await expect(page.locator("#gallery > div")).not.toHaveAttribute(
      "style",
      /height/,
    );
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});

test.describe("navigation", () => {
  test.beforeEach(async ({ page }) => {
    await skipIntro(page);
    await page.goto("/");
  });

  test("desktop links scroll to sections", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop navigation only");
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "Ритуалы" })
      .click();
    await expect(page).toHaveURL(/#rituals$/);
    await expect(page.locator("#rituals")).toBeInViewport();
  });

  test("mobile menu opens and closes on navigation", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "mobile menu only");
    const burger = page.getByRole("button", { name: "Меню" });

    await burger.click();
    await expect(burger).toHaveAttribute("aria-expanded", "true");
    await page
      .locator("#mobile-menu")
      .getByRole("link", { name: /Мастера/ })
      .click();

    await expect(burger).toHaveAttribute("aria-expanded", "false");
    await expect(page).toHaveURL(/#masters$/);
  });
});
