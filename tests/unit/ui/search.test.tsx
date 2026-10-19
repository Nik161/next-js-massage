import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";

const replace = vi.hoisted(() => vi.fn());
vi.mock("next/navigation", () => ({
  usePathname: () => "/bookings",
  useSearchParams: () => new URLSearchParams("page=3"),
  useRouter: () => ({ replace }),
}));

import Search from "@/app/ui/shared/search";

describe("Search", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    replace.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("updates the URL after typing stops and resets to page 1", () => {
    render(<Search placeholder="Искать" />);
    const input = screen.getByPlaceholderText("Искать");

    fireEvent.change(input, { target: { value: "ан" } });
    fireEvent.change(input, { target: { value: "анна" } });
    expect(replace).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(400));
    expect(replace).toHaveBeenCalledOnce();
    expect(replace).toHaveBeenCalledWith(
      "/bookings?page=1&query=%D0%B0%D0%BD%D0%BD%D0%B0",
    );
  });

  it("drops the query when the field is cleared", () => {
    render(<Search placeholder="Искать" />);
    const input = screen.getByPlaceholderText("Искать");
    fireEvent.change(input, { target: { value: "анна" } });
    fireEvent.change(input, { target: { value: "" } });
    act(() => vi.advanceTimersByTime(400));
    expect(replace).toHaveBeenCalledWith("/bookings?page=1");
  });
});
