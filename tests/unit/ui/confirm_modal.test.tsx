import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfirmModal from "@/app/ui/shared/confirmModal";
import { selectOpenModalId } from "@/app/lib/store/ui_slice";
import { makeTestStore, storeWrapper } from "@/tests/unit/helpers/store";

function renderModal(
  props: Partial<Parameters<typeof ConfirmModal>[0]> = {},
  store = makeTestStore(),
) {
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
    { wrapper: storeWrapper(store) },
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

  it("keeps the open modal in the store", async () => {
    const store = makeTestStore();
    renderModal({}, store);

    await userEvent.click(screen.getByTitle("Удалить запись"));
    expect(selectOpenModalId(store.getState())).not.toBeNull();

    await userEvent.click(screen.getByRole("button", { name: "Отмена" }));
    expect(selectOpenModalId(store.getState())).toBeNull();
  });

  it("opens only the modal whose trigger was clicked", async () => {
    render(
      <>
        <ConfirmModal
          action={vi.fn()}
          title="Первый"
          message=""
          confirmText="Да"
          triggerTitle="first"
        >
          1
        </ConfirmModal>
        <ConfirmModal
          action={vi.fn()}
          title="Второй"
          message=""
          confirmText="Да"
          triggerTitle="second"
        >
          2
        </ConfirmModal>
      </>,
      { wrapper: storeWrapper() },
    );

    await userEvent.click(screen.getByTitle("second"));
    expect(screen.getByText("Второй")).toBeInTheDocument();
    expect(screen.queryByText("Первый")).not.toBeInTheDocument();
  });

  it("is no longer open in the store after it unmounts", async () => {
    const store = makeTestStore();
    const { unmount } = renderModal({}, store);
    await userEvent.click(screen.getByTitle("Удалить запись"));
    unmount();
    expect(selectOpenModalId(store.getState())).toBeNull();
  });
});
