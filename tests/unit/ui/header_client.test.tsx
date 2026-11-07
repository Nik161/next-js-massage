import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("next-auth/react", () => ({ signIn: vi.fn(), signOut: vi.fn() }));
// next/font only works inside the Next.js compiler
vi.mock("@/app/ui/fonts", () => ({ cormorant: { className: "" } }));

import HeaderClient from "@/app/ui/header/header-client";
import {
  selectIsHeaderHidden,
  selectIsHeaderScrolled,
  selectIsMobileMenuOpen,
} from "@/app/lib/store/ui_slice";
import { makeTestStore, storeWrapper } from "@/tests/unit/helpers/store";

describe("HeaderClient mobile menu", () => {
  it("opens and closes through the store", async () => {
    const store = makeTestStore();
    render(<HeaderClient />, { wrapper: storeWrapper(store) });
    const burger = screen.getByRole("button", { name: "Меню" });

    await userEvent.click(burger);
    expect(selectIsMobileMenuOpen(store.getState())).toBe(true);
    expect(burger).toHaveAttribute("aria-expanded", "true");
    expect(document.body.style.overflow).toBe("hidden");

    // Links in the menu close it before navigating
    await userEvent.click(
      screen.getByRole("link", { name: "Записаться на сеанс" }),
    );
    expect(selectIsMobileMenuOpen(store.getState())).toBe(false);
    expect(document.body.style.overflow).toBe("");
  });

  it("closes the menu when the header unmounts", async () => {
    const store = makeTestStore();
    const { unmount } = render(<HeaderClient />, {
      wrapper: storeWrapper(store),
    });
    await userEvent.click(screen.getByRole("button", { name: "Меню" }));
    unmount();
    expect(selectIsMobileMenuOpen(store.getState())).toBe(false);
  });
});

describe("HeaderClient scrolling", () => {
  // jsdom never scrolls, so scrollY is set by hand
  function setScrollY(y: number) {
    Object.defineProperty(window, "scrollY", { value: y, configurable: true });
  }

  afterEach(() => setScrollY(0));

  function scrollTo(y: number) {
    act(() => {
      setScrollY(y);
      window.dispatchEvent(new Event("scroll"));
    });
  }

  it("keeps the scroll state in the store", () => {
    const store = makeTestStore();
    render(<HeaderClient />, { wrapper: storeWrapper(store) });
    const nav = screen.getByRole("navigation");

    scrollTo(100);
    expect(selectIsHeaderScrolled(store.getState())).toBe(true);
    expect(selectIsHeaderHidden(store.getState())).toBe(false);
    expect(nav.className).toContain("backdrop-blur-xl");

    // Scrolling down far hides the header, scrolling up shows it again
    scrollTo(600);
    expect(selectIsHeaderHidden(store.getState())).toBe(true);
    expect(nav.className).toContain("-translate-y-full");
    scrollTo(500);
    expect(selectIsHeaderHidden(store.getState())).toBe(false);

    scrollTo(0);
    expect(selectIsHeaderScrolled(store.getState())).toBe(false);
  });

  it("dispatches only when the header has to change", () => {
    const store = makeTestStore();
    render(<HeaderClient />, { wrapper: storeWrapper(store) });
    const listener = vi.fn();
    store.subscribe(listener);

    scrollTo(100);
    scrollTo(150);
    scrollTo(200);
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
