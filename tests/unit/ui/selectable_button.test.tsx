import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SelectableButton from "@/app/ui/booking/selectable_button";

describe("SelectableButton", () => {
  it("reports its state through aria-pressed", () => {
    const { rerender } = render(
      <SelectableButton selected={false} onClick={() => {}}>
        Нико
      </SelectableButton>,
    );
    expect(screen.getByRole("button", { name: "Нико" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );

    rerender(
      <SelectableButton selected onClick={() => {}}>
        Нико
      </SelectableButton>,
    );
    expect(screen.getByRole("button", { name: "Нико" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("is a non-submitting button that calls onClick", async () => {
    const onClick = vi.fn();
    render(
      <SelectableButton selected={false} onClick={onClick}>
        09:00
      </SelectableButton>,
    );

    const button = screen.getByRole("button", { name: "09:00" });
    expect(button).toHaveAttribute("type", "button");
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("shows a check badge only on selected cards", () => {
    const { container, rerender } = render(
      <SelectableButton selected onClick={() => {}}>
        card
      </SelectableButton>,
    );
    expect(container.querySelector("svg")).toBeInTheDocument();

    rerender(
      <SelectableButton selected variant="chip" onClick={() => {}}>
        chip
      </SelectableButton>,
    );
    expect(container.querySelector("svg")).not.toBeInTheDocument();
  });
});
