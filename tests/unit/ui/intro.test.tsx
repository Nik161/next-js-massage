import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render } from "@testing-library/react";

// next/font only works inside the Next.js compiler
vi.mock("@/app/ui/fonts", () => ({ cormorant: { className: "" } }));

import Intro from "@/app/ui/motion/intro";
import {
  selectHasIntroPlayed,
  selectIsIntroShown,
} from "@/app/lib/store/ui_slice";
import { makeTestStore, storeWrapper } from "@/tests/unit/helpers/store";

describe("Intro", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    delete document.documentElement.dataset.introSeen;
  });

  afterEach(() => {
    vi.useRealTimers();
    document.documentElement.style.overflow = "";
  });

  it("plays once and then hides", () => {
    const store = makeTestStore();
    const { container } = render(<Intro />, { wrapper: storeWrapper(store) });

    expect(container.querySelector(".intro")).not.toBeNull();
    expect(selectHasIntroPlayed(store.getState())).toBe(true);
    expect(document.documentElement.style.overflow).toBe("hidden");

    act(() => vi.advanceTimersByTime(2600));
    expect(selectIsIntroShown(store.getState())).toBe(false);
    expect(container.querySelector(".intro")).toBeNull();
    expect(document.documentElement.style.overflow).toBe("");
  });

  it("hides on click", () => {
    const store = makeTestStore();
    const { container } = render(<Intro />, { wrapper: storeWrapper(store) });
    act(() => (container.querySelector(".intro") as HTMLElement).click());
    expect(selectIsIntroShown(store.getState())).toBe(false);
  });

  it("does not play again after leaving mid-curtain", () => {
    const store = makeTestStore();
    const wrapper = storeWrapper(store);
    render(<Intro />, { wrapper }).unmount();

    const { container } = render(<Intro />, { wrapper });
    expect(container.querySelector(".intro")).toBeNull();
  });
});
