import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { BookingResponse } from "@/app/lib/definitions";

vi.mock("@/app/lib/api_client", () => ({
  ApiRequestError: class extends Error {
    constructor(
      public status: number,
      public body: { error: string; fieldErrors?: object },
    ) {
      super(body.error);
    }
  },
  createBooking: vi.fn(),
  updateBooking: vi.fn(),
}));
const router = vi.hoisted(() => ({ push: vi.fn(), refresh: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => router }));

import CreateOrEditBookingForm from "@/app/ui/booking/create_or_edit_form";
import { getToday } from "@/app/lib/booking_time";
import {
  ApiRequestError,
  createBooking,
  updateBooking,
} from "@/app/lib/api_client";
import {
  makeTestStore,
  storeWrapper,
  TEST_USER,
} from "@/tests/unit/helpers/store";

const THERAPISTS = [
  { id: "t-niko", name: "Нико", description: "Описание Нико", image_url: null },
  { id: "t-bratik", name: "Братик", description: null, image_url: null },
];
const MASSAGE_TYPES = [
  { id: "thai", name: "Тайский", description: "Меридианы" },
  { id: "relax", name: "Релакс", description: "" },
];

const TEST_USER_NO_NAME = { ...TEST_USER, name: "" };

const fetchMock = vi.fn();

function renderForm(
  props: Partial<Parameters<typeof CreateOrEditBookingForm>[0]> = {},
  store = makeTestStore(),
) {
  const view = render(
    <CreateOrEditBookingForm
      therapists={THERAPISTS}
      massageTypes={MASSAGE_TYPES}
      {...props}
    />,
    { wrapper: storeWrapper(store) },
  );
  const hidden = (name: string) =>
    view.container.querySelector<HTMLInputElement>(`input[name="${name}"]`)!
      .value;
  return { ...view, hidden };
}

const next = () =>
  userEvent.click(screen.getByRole("button", { name: /Далее/ }));

describe("CreateOrEditBookingForm", () => {
  beforeEach(() => {
    router.push.mockClear();
    router.refresh.mockClear();
    fetchMock.mockReset();
    // A fresh Response per call: a body can only be read once
    fetchMock.mockImplementation(
      async () =>
        new Response(JSON.stringify({ slots: ["09:00", "13:30", "18:00"] })),
    );
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("walks through therapist → program → date and time", async () => {
    const { hidden } = renderForm();

    // Step 1: next is disabled until a therapist is chosen
    expect(screen.getByRole("button", { name: /Далее/ })).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: /Нико/ }));
    expect(hidden("therapist_id")).toBe("t-niko");
    await next();

    // Step 2: program and duration
    expect(
      screen.getByRole("heading", { name: "Выберите программу" }),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /Тайский/ }));
    expect(screen.getByRole("button", { name: /Далее/ })).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: /60/ }));
    await next();

    // Step 3: slots come from the API, grouped by part of day
    expect(
      await screen.findByRole("button", { name: "13:30" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Утро")).toBeInTheDocument();
    expect(screen.getByText("Вечер")).toBeInTheDocument();
    expect(fetchMock.mock.calls[0][0]).toContain("therapistId=t-niko");
    expect(fetchMock.mock.calls[0][0]).toContain("duration=60");

    const submit = screen.getByRole("button", { name: "Записаться" });
    expect(submit).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: "13:30" }));
    expect(submit).toBeEnabled();

    expect(hidden("massage_type")).toBe("thai");
    expect(hidden("booking_duration")).toBe("60");
    expect(hidden("booking_date")).toBe(getToday());
    expect(hidden("booking_time")).toBe("13:30");
  });

  it("keeps the summary in sync with the choices", async () => {
    renderForm();
    const summary = screen.getByRole("complementary");

    await userEvent.click(screen.getByRole("button", { name: /Братик/ }));
    expect(within(summary).getByText("Братик")).toBeInTheDocument();
    expect(within(summary).getByText("Анна")).toBeInTheDocument();
  });

  it("falls back to the email when the user has no name", () => {
    renderForm({}, makeTestStore({ ...TEST_USER_NO_NAME }));
    const summary = screen.getByRole("complementary");
    expect(within(summary).getByText("anna@example.com")).toBeInTheDocument();
  });

  it("shows the user's balance only when creating", async () => {
    const booking = {
      id: "b-1",
      date: "2026-10-22 18:00",
      therapist_id: "t-bratik",
      massage_type: "relax",
      duration: 90,
    } as BookingResponse;

    const { unmount } = renderForm({ initialTherapistId: "t-niko" });
    await next();
    expect(screen.getByText(/120/)).toBeInTheDocument();
    unmount();

    renderForm({ booking });
    await next();
    expect(screen.queryByText(/120/)).not.toBeInTheDocument();
  });

  it("resets the chosen time when the duration changes", async () => {
    const { hidden } = renderForm({ initialTherapistId: "t-niko" });
    await next();
    await userEvent.click(screen.getByRole("button", { name: /Тайский/ }));
    await userEvent.click(screen.getByRole("button", { name: /30/ }));
    await next();
    await userEvent.click(await screen.findByRole("button", { name: "09:00" }));
    expect(hidden("booking_time")).toBe("09:00");

    await userEvent.click(screen.getByRole("button", { name: /Программа/ }));
    await userEvent.click(screen.getByRole("button", { name: /90/ }));
    expect(hidden("booking_time")).toBe("");
  });

  it("preselects the therapist chosen on the landing page", () => {
    const { hidden } = renderForm({ initialTherapistId: "t-bratik" });
    expect(hidden("therapist_id")).toBe("t-bratik");
    expect(screen.getByRole("button", { name: /Далее/ })).toBeEnabled();
  });

  it("starts from the existing booking when editing", async () => {
    const booking = {
      id: "b-1",
      date: "2026-10-22 18:00",
      therapist_id: "t-bratik",
      massage_type: "relax",
      duration: 90,
    } as BookingResponse;

    const { hidden } = renderForm({ booking });

    expect(hidden("therapist_id")).toBe("t-bratik");
    expect(hidden("booking_date")).toBe("2026-10-22");
    expect(hidden("booking_time")).toBe("18:00");
    expect(hidden("massage_type")).toBe("relax");
    expect(hidden("booking_duration")).toBe("90");

    await next();
    await next();
    expect(
      await screen.findByRole("button", { name: "Сохранить изменения" }),
    ).toBeEnabled();
    expect(fetchMock.mock.calls[0][0]).toContain("excludeBookingId=b-1");
  });

  it("starts over when the form is opened again", async () => {
    const wrapper = storeWrapper();
    const first = render(
      <CreateOrEditBookingForm
        therapists={THERAPISTS}
        massageTypes={MASSAGE_TYPES}
      />,
      { wrapper },
    );
    await userEvent.click(screen.getByRole("button", { name: /Нико/ }));
    await next();
    first.unmount();

    const second = render(
      <CreateOrEditBookingForm
        therapists={THERAPISTS}
        massageTypes={MASSAGE_TYPES}
      />,
      { wrapper },
    );
    expect(
      second.container.querySelector<HTMLInputElement>(
        'input[name="therapist_id"]',
      )!.value,
    ).toBe("");
    expect(screen.getByRole("button", { name: /Далее/ })).toBeDisabled();
  });

  it("shows a friendly message when slots cannot be loaded", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    fetchMock.mockImplementation(
      async () => new Response("{}", { status: 500 }),
    );
    renderForm({ initialTherapistId: "t-niko" });
    await next();
    await userEvent.click(screen.getByRole("button", { name: /Тайский/ }));
    await userEvent.click(screen.getByRole("button", { name: /60/ }));
    await next();

    expect(
      await screen.findByText(/Не удалось загрузить свободное время/),
    ).toBeInTheDocument();
  });

  describe("submitting", () => {
    const booking = {
      id: "b-1",
      date: "2026-10-22 18:00",
      therapist_id: "t-bratik",
      massage_type: "relax",
      duration: 90,
    } as BookingResponse;

    async function submit() {
      await next();
      await next();
      await userEvent.click(
        await screen.findByRole("button", { name: "Сохранить изменения" }),
      );
    }

    it("saves the booking and goes back to the list", async () => {
      vi.mocked(updateBooking).mockResolvedValue({ booking });
      renderForm({ booking });
      await submit();

      expect(updateBooking).toHaveBeenCalledWith("b-1", {
        therapist_id: "t-bratik",
        date: "2026-10-22",
        time: "18:00",
        massage_type: "relax",
        duration: 90,
      });
      expect(createBooking).not.toHaveBeenCalled();
      expect(router.push).toHaveBeenCalledWith("/bookings");
      expect(router.refresh).toHaveBeenCalled();
    });

    it("shows the error the API reports and stays on the page", async () => {
      vi.mocked(updateBooking).mockRejectedValue(
        new ApiRequestError(409, { error: "Это время уже занято." }),
      );
      renderForm({ booking });
      await submit();

      expect(
        await screen.findByText("Это время уже занято."),
      ).toBeInTheDocument();
      expect(router.push).not.toHaveBeenCalled();
    });

    it("shows a generic message when the request fails", async () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      vi.mocked(updateBooking).mockRejectedValue(new TypeError("offline"));
      renderForm({ booking });
      await submit();

      expect(
        await screen.findByText(/Не удалось отправить запрос/),
      ).toBeInTheDocument();
    });
  });
});
