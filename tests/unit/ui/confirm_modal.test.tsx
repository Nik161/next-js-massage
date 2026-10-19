import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfirmModal from "@/app/ui/shared/confirmModal";

function renderModal(props: Partial<Parameters<typeof ConfirmModal>[0]> = {}) {
  return render(
    <ConfirmModal
      action={vi.fn().mockResolvedValue(undefined)}
      title="Удалить бронирование?"
      message="Без возможности восстановления."
      confirmText="Удалить"
      triggerTitle="Удалить запись"
      {...props}
    >
      <span>trigger</span>
    </ConfirmModal>,
  );
}

describe("ConfirmModal", () => {
  it("opens on the trigger and closes on cancel", async () => {
    renderModal();
    expect(screen.queryByText("Удалить бронирование?")).not.toBeInTheDocument();

    await userEvent.click(screen.getByTitle("Удалить запись"));
    expect(
      screen.getByRole("dialog", { name: "Удалить бронирование?" }),
    ).toHaveAttribute("open");

    await userEvent.click(screen.getByRole("button", { name: "Отмена" }));
    expect(screen.queryByText("Удалить бронирование?")).not.toBeInTheDocument();
  });

  it("runs the action on confirm", async () => {
    const action = vi.fn().mockResolvedValue(undefined);
    renderModal({ action });

    await userEvent.click(screen.getByTitle("Удалить запись"));
    await userEvent.click(screen.getByRole("button", { name: "Удалить" }));

    expect(action).toHaveBeenCalled();
  });

  it("cannot be opened when disabled", async () => {
    renderModal({ disabled: true });
    expect(screen.getByTitle("Удалить запись")).toBeDisabled();
  });
});
