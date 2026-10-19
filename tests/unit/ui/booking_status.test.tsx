import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import BookingStatus from "@/app/ui/booking/booking_status";

describe("BookingStatus", () => {
  it.each([
    ["booked", "Ожидает"],
    ["confirmed", "Подтверждён"],
    ["completed", "Завершён"],
    ["canceled", "Отменён"],
  ] as const)("labels %s as %s", (status, label) => {
    render(<BookingStatus status={status} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});
