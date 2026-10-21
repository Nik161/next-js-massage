// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import postgres from "postgres";

const mocks = vi.hoisted(() => ({
  sql: vi.fn(),
  isSlotAvailable: vi.fn(),
  sendEmail: vi.fn(),
}));

vi.mock("@/app/lib/db", () => ({ sql: mocks.sql }));
vi.mock("@/app/lib/data/availability", () => ({
  isSlotAvailable: mocks.isSlotAvailable,
}));
vi.mock("@/app/lib/email/booking_email", () => ({
  sendBookingEmailToTherapist: mocks.sendEmail,
}));

import { ApiError } from "@/app/lib/api/http";
import {
  BookingInputSchema,
  createBooking,
  deleteBooking,
  setBookingStatus,
  updateBooking,
} from "@/app/lib/bookings";

const THERAPIST = "e67190e7-db41-4612-9963-6ada87745747";
const BOOKING = {
  therapist_id: THERAPIST,
  date: "2026-10-20",
  time: "14:00",
  massage_type: "thai",
  duration: 60,
};

function exclusionViolation() {
  // Same shape postgres.js throws for a violated EXCLUDE constraint
  return Object.assign(Object.create(postgres.PostgresError.prototype), {
    code: "23P01",
  });
}

// Flattens the values interpolated into the last sql`` call
function lastQueryValues() {
  return mocks.sql.mock.calls.at(-1)!.slice(1);
}

async function expectApiError(promise: Promise<unknown>, status: number) {
  const error = await promise.catch((e: unknown) => e);
  expect(error).toBeInstanceOf(ApiError);
  expect((error as ApiError).status).toBe(status);
  return error as ApiError;
}

beforeEach(() => {
  for (const mock of Object.values(mocks)) mock.mockReset();
  mocks.isSlotAvailable.mockResolvedValue(true);
  mocks.sql.mockResolvedValue([{ id: "booking-1" }]);
  mocks.sendEmail.mockResolvedValue({});
});

describe("BookingInputSchema", () => {
  it("reports every invalid field", () => {
    const result = BookingInputSchema.safeParse({
      ...BOOKING,
      time: "",
      duration: 45,
      therapist_id: "x",
    });

    expect(result.success).toBe(false);
    expect(Object.keys(result.error!.flatten().fieldErrors)).toEqual(
      expect.arrayContaining(["time", "duration", "therapist_id"]),
    );
  });
});

describe("createBooking", () => {
  it("refuses a slot that is no longer free", async () => {
    mocks.isSlotAvailable.mockResolvedValue(false);

    const error = await expectApiError(createBooking("user-1", BOOKING), 409);

    expect(error.message).toBe("Это время уже занято, выберите другое.");
    expect(mocks.sql).not.toHaveBeenCalled();
  });

  it("inserts the booking with its end time and notifies", async () => {
    const id = await createBooking("user-1", BOOKING);

    expect(mocks.isSlotAvailable).toHaveBeenCalledWith({
      therapistId: THERAPIST,
      date: "2026-10-20",
      time: "14:00",
      duration: 60,
      excludeBookingId: undefined,
    });
    const values = lastQueryValues();
    expect(values).toContain(id);
    expect(values).toContainEqual(new Date("2026-10-20T14:00:00Z"));
    expect(values).toContainEqual(new Date("2026-10-20T15:00:00Z"));
    expect(values).toContain("user-1");
    expect(values).toContain("booked");
    expect(mocks.sendEmail).toHaveBeenCalledWith({
      type: "thai",
      duration: 60,
      date: "2026-10-20",
      time: "14:00",
    });
  });

  it("reports a taken slot when the overlap constraint fires", async () => {
    mocks.sql.mockRejectedValue(exclusionViolation());
    await expectApiError(createBooking("user-1", BOOKING), 409);
  });

  it("lets other database errors through", async () => {
    mocks.sql.mockRejectedValue(new Error("connection lost"));
    await expect(createBooking("user-1", BOOKING)).rejects.toThrow(
      "connection lost",
    );
  });

  it("still books when the email fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.sendEmail.mockRejectedValue(new Error("resend down"));

    await expect(createBooking("user-1", BOOKING)).resolves.toEqual(
      expect.any(String),
    );
  });
});

describe("updateBooking", () => {
  it("does not let the booking block its own slot", async () => {
    await updateBooking("booking-1", BOOKING);

    expect(mocks.isSlotAvailable).toHaveBeenCalledWith(
      expect.objectContaining({ excludeBookingId: "booking-1" }),
    );
    expect(lastQueryValues()).toContain("booking-1");
  });

  it("reports a taken slot when the overlap constraint fires", async () => {
    mocks.sql.mockRejectedValue(exclusionViolation());
    await expectApiError(updateBooking("booking-1", BOOKING), 409);
  });

  it("reports a missing booking", async () => {
    mocks.sql.mockResolvedValue([]);
    await expectApiError(updateBooking("booking-1", BOOKING), 404);
    expect(mocks.sendEmail).not.toHaveBeenCalled();
  });
});

describe("deleteBooking", () => {
  it("deletes by id", async () => {
    await deleteBooking("booking-1");
    expect(lastQueryValues()).toEqual(["booking-1"]);
  });

  it("reports a missing booking", async () => {
    mocks.sql.mockResolvedValue([]);
    await expectApiError(deleteBooking("booking-1"), 404);
  });
});

describe("setBookingStatus", () => {
  it("updates the status", async () => {
    await setBookingStatus("booking-1", "completed");
    expect(lastQueryValues()).toEqual(["completed", "booking-1"]);
  });

  it("reports a missing booking", async () => {
    mocks.sql.mockResolvedValue([]);
    await expectApiError(setBookingStatus("booking-1", "confirmed"), 404);
  });
});
