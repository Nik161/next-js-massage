import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import Reveal from "@/app/ui/motion/reveal";

type Callback = (entries: Partial<IntersectionObserverEntry>[]) => void;

describe("Reveal", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("marks itself visible once it enters the viewport, then stops observing", () => {
    let trigger: Callback = () => {};
    const disconnect = vi.fn();
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback: Callback) {
          trigger = callback;
        }
        observe() {}
        disconnect = disconnect;
      },
    );

    render(
      <Reveal variant="blur" delay={200}>
        content
      </Reveal>,
    );
    const element = screen.getByText("content");

    expect(element).toHaveAttribute("data-reveal", "blur");
    expect(element).not.toHaveAttribute("data-visible");
    expect(element.style.getPropertyValue("--reveal-delay")).toBe("200ms");

    act(() => trigger([{ isIntersecting: true }]));

    expect(element).toHaveAttribute("data-visible", "true");
    expect(disconnect).toHaveBeenCalled();
  });
});
