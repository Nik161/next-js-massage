import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookingProgress from "@/app/ui/booking/booking_progress";

describe("BookingProgress", () => {
  it("lets the user jump back only to completed steps", async () => {
    const setStep = vi.fn();
    render(<BookingProgress step={2} setStep={setStep} />);

    const [therapist, program, dateTime] = screen.getAllByRole("button");
    expect(therapist).toBeEnabled();
    expect(program).toBeDisabled();
    expect(program).toHaveAttribute("aria-current", "step");
    expect(dateTime).toBeDisabled();

    await userEvent.click(therapist);
    expect(setStep).toHaveBeenCalledWith(1);
  });
});
