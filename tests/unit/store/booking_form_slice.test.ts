import { describe, expect, it, vi } from "vitest";

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

import {
  ApiRequestError,
  createBooking,
  updateBooking,
} from "@/app/lib/api_client";
import { makeStore } from "@/app/lib/store/store";
import {
  bookingFormStarted,
  dateSelected,
  durationSelected,
  getInitialSelection,
  massageTypeSelected,
  selectCanSubmit,
  selectDirection,
  selectIsSubmitting,
  selectSelection,
  selectStep,
  selectSubmitResult,
  stepChanged,
  submitBooking,
  therapistSelected,
  timeSelected,
} from "@/app/lib/store/booking_form_slice";
import type { BookingResponse } from "@/app/lib/definitions";
import { getToday } from "@/app/lib/booking_time";

const FULL = {
  therapistId: "t-1",
  date: "2026-10-20",
  time: "10:00",
  massageType: "thai",
  duration: 60,
};

function started(selection = FULL) {
  const store = makeStore();
  store.dispatch(bookingFormStarted(selection));
  return store;
}

describe("bookingForm slice", () => {
  it("builds the selection from an existing booking", () => {
    const booking = {
      date: "2026-10-22 18:00",
      therapist_id: "t-2",
      massage_type: "relax",
      duration: 90,
    } as BookingResponse;
    expect(getInitialSelection(booking)).toEqual({
      therapistId: "t-2",
      date: "2026-10-22",
      time: "18:00",
      massageType: "relax",
      duration: 90,
    });
    expect(getInitialSelection(undefined, "t-3")).toMatchObject({
      therapistId: "t-3",
      date: getToday(),
    });
  });

  it("starting over resets the step", () => {
    const store = started();
    store.dispatch(stepChanged(3));
    store.dispatch(bookingFormStarted(getInitialSelection()));
    const state = store.getState();
    expect(selectStep(state)).toBe(1);
    expect(selectSelection(state).therapistId).toBe("");
  });

  it("tracks the direction of step changes", () => {
    const store = started();
    store.dispatch(stepChanged(3));
    expect(selectDirection(store.getState())).toBe("forward");
    store.dispatch(stepChanged(2));
    expect(selectDirection(store.getState())).toBe("back");
  });

  it.each([
    ["therapist", therapistSelected("t-9")],
    ["duration", durationSelected(90)],
    ["date", dateSelected("2026-10-21")],
  ])("changing the %s resets the time", (_name, action) => {
    const store = started();
    store.dispatch(action);
    expect(selectSelection(store.getState()).time).toBe("");
    expect(selectCanSubmit(store.getState())).toBe(false);
  });

  it("keeps the time when only the massage type changes", () => {
    const store = started();
    store.dispatch(massageTypeSelected("relax"));
    expect(selectSelection(store.getState()).time).toBe("10:00");
    expect(selectCanSubmit(store.getState())).toBe(true);
  });

  it("can submit once every field is chosen", () => {
    const store = started({ ...FULL, time: "" });
    expect(selectCanSubmit(store.getState())).toBe(false);
    store.dispatch(timeSelected("11:00"));
    expect(selectCanSubmit(store.getState())).toBe(true);
  });

  describe("submitBooking", () => {
    const INPUT = {
      therapist_id: "t-1",
      date: "2026-10-20",
      time: "10:00",
      massage_type: "thai",
      duration: 60,
    };

    it("creates a booking from the selection", async () => {
      vi.mocked(createBooking).mockResolvedValue(undefined as never);
      const store = started();
      const pending = store.dispatch(submitBooking({}));
      expect(selectIsSubmitting(store.getState())).toBe(true);
      await pending;

      expect(createBooking).toHaveBeenCalledWith(INPUT);
      expect(selectIsSubmitting(store.getState())).toBe(false);
      expect(selectSubmitResult(store.getState()).message).toBeNull();
    });

    it("updates when a booking id is given", async () => {
      vi.mocked(updateBooking).mockResolvedValue(undefined as never);
      await started().dispatch(submitBooking({ bookingId: "b-1" }));
      expect(updateBooking).toHaveBeenCalledWith("b-1", INPUT);
    });

    it("keeps the API's message and field errors", async () => {
      vi.mocked(createBooking).mockRejectedValue(
        new ApiRequestError(400, {
          error: "Проверьте поля.",
          fieldErrors: { time: ["Неверное время"] },
        }),
      );
      const store = started();
      const result = await store.dispatch(submitBooking({}));

      expect(submitBooking.rejected.match(result)).toBe(true);
      expect(selectSubmitResult(store.getState())).toEqual({
        message: "Проверьте поля.",
        errors: { time: ["Неверное время"] },
      });
      expect(selectIsSubmitting(store.getState())).toBe(false);
    });

    it("clears old errors when the form starts over", async () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      vi.mocked(createBooking).mockRejectedValue(new TypeError("offline"));
      const store = started();
      await store.dispatch(submitBooking({}));
      expect(selectSubmitResult(store.getState()).message).toMatch(
        /Не удалось отправить запрос/,
      );

      store.dispatch(bookingFormStarted(FULL));
      expect(selectSubmitResult(store.getState()).message).toBeNull();
    });
  });
});
