import { describe, expect, it } from "vitest";
import { makeStore } from "@/app/lib/store/store";
import {
  headerScrolled,
  introHidden,
  introStarted,
  mobileMenuClosed,
  mobileMenuToggled,
  modalClosed,
  modalOpened,
  selectHasIntroPlayed,
  selectIsHeaderHidden,
  selectIsHeaderScrolled,
  selectIsIntroShown,
  selectIsMobileMenuOpen,
  selectOpenModalId,
} from "@/app/lib/store/ui_slice";

describe("ui slice", () => {
  it("starts with everything closed and the intro waiting to play", () => {
    const state = makeStore().getState();
    expect(selectIsMobileMenuOpen(state)).toBe(false);
    expect(selectIsHeaderScrolled(state)).toBe(false);
    expect(selectIsHeaderHidden(state)).toBe(false);
    expect(selectIsIntroShown(state)).toBe(true);
    expect(selectHasIntroPlayed(state)).toBe(false);
    expect(selectOpenModalId(state)).toBeNull();
  });

  it("toggles and closes the mobile menu", () => {
    const store = makeStore();
    store.dispatch(mobileMenuToggled());
    expect(selectIsMobileMenuOpen(store.getState())).toBe(true);
    store.dispatch(mobileMenuToggled());
    expect(selectIsMobileMenuOpen(store.getState())).toBe(false);

    store.dispatch(mobileMenuToggled());
    store.dispatch(mobileMenuClosed());
    expect(selectIsMobileMenuOpen(store.getState())).toBe(false);
  });

  it("stores the header scroll state", () => {
    const store = makeStore();
    store.dispatch(headerScrolled({ isScrolled: true, isHidden: true }));
    expect(selectIsHeaderScrolled(store.getState())).toBe(true);
    expect(selectIsHeaderHidden(store.getState())).toBe(true);
  });

  it("tracks the intro", () => {
    const store = makeStore();
    store.dispatch(introStarted());
    expect(selectHasIntroPlayed(store.getState())).toBe(true);
    expect(selectIsIntroShown(store.getState())).toBe(true);
    store.dispatch(introHidden());
    expect(selectIsIntroShown(store.getState())).toBe(false);
  });

  it("lets a modal close only itself", () => {
    const store = makeStore();
    store.dispatch(modalOpened("a"));
    store.dispatch(modalClosed("b"));
    expect(selectOpenModalId(store.getState())).toBe("a");
    store.dispatch(modalClosed("a"));
    expect(selectOpenModalId(store.getState())).toBeNull();
  });
});
