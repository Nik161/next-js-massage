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

  it("hides the balance when it is not given (editing)", () => {
    renderStep();
    expect(screen.queryByText(/На балансе/)).not.toBeInTheDocument();
  });
});
