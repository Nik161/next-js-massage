import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const searchParams = vi.hoisted(() => ({ current: new URLSearchParams() }));
vi.mock("next/navigation", () => ({
  usePathname: () => "/bookings",
  useSearchParams: () => searchParams.current,
}));

import Pagination from "@/app/ui/shared/pagination";

describe("Pagination", () => {
  it("renders nothing for a single page", () => {
    const { container } = render(<Pagination totalPages={1} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("marks the current page and keeps other query params", () => {
    searchParams.current = new URLSearchParams("query=anna&page=2");
    render(<Pagination totalPages={3} />);

    expect(screen.getByText("2")).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "3" })).toHaveAttribute(
      "href",
      "/bookings?query=anna&page=3",
    );
    expect(screen.getByRole("link", { name: "Предыдущая" })).toHaveAttribute(
      "href",
      "/bookings?query=anna&page=1",
    );
  });

  it("disables arrows at the edges", () => {
    searchParams.current = new URLSearchParams("page=1");
    render(<Pagination totalPages={3} />);
    expect(
      screen.queryByRole("link", { name: "Предыдущая" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Следующая" })).toBeInTheDocument();
  });
});
