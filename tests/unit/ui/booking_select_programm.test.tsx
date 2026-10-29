import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import BookingSelectProgramm from "@/app/ui/booking/booking_select_programm";

function renderStep(balance?: number) {
  const noop = () => {};
  render(
    <BookingSelectProgramm
      massageTypes={[]}
      selectedMassage=""
      selectedDuration={0}
      balance={balance}
      onMassageChange={noop}
      onDurationChange={noop}
      onBack={noop}
      onNext={noop}
    />,
  );
}

describe("BookingSelectProgramm", () => {
  it("shows the user's minute balance", () => {
    renderStep(90);
    expect(screen.getByText("90 мин.")).toBeInTheDocument();
  });

  it("disables durations the balance does not cover", () => {
    renderStep(60);

    expect(screen.getByRole("button", { name: /30/ })).toBeEnabled();
    expect(screen.getByRole("button", { name: /60/ })).toBeEnabled();
    expect(screen.getByRole("button", { name: /90/ })).toBeDisabled();
    expect(screen.queryByText(/не хватает/)).not.toBeInTheDocument();
  });

  it("explains when no duration is affordable", () => {
    renderStep(0);

    for (const name of [/30/, /60/, /90/]) {
      expect(screen.getByRole("button", { name })).toBeDisabled();
    }
    expect(screen.getByText(/не хватает ни на одну/)).toBeInTheDocument();
  });

  it("hides the balance and allows every duration when editing", () => {
    renderStep();

    expect(screen.queryByText(/На балансе/)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /90/ })).toBeEnabled();
  });
});
