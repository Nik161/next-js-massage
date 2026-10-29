// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import postgres from "postgres";

const mocks = vi.hoisted(() => ({
  sql: vi.fn(),
  isSlotAvailable: vi.fn(),
  sendEmail: vi.fn(),
  sendCreatedEmail: vi.fn(),
  sendConfirmedEmail: vi.fn(),
  sendUpdatedEmail: vi.fn(),
  sendUpdatedClientEmail: vi.fn(),
}));

vi.mock("@/app/lib/db", () => ({ sql: mocks.sql }));
vi.mock("@/app/lib/data/availability", () => ({
  isSlotAvailable: mocks.isSlotAvailable,
}));
vi.mock("@/app/lib/email/booking_email", () => ({
  sendBookingEmailToTherapist: mocks.sendEmail,
  sendBookingCreatedEmailToClient: mocks.sendCreatedEmail,
  sendBookingConfirmedEmailToClient: mocks.sendConfirmedEmail,
  sendBookingUpdatedEmailToTherapist: mocks.sendUpdatedEmail,
  sendBookingUpdatedEmailToClient: mocks.sendUpdatedClientEmail,
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
// Client and therapist read back together with the written booking
const PEOPLE = {
  client_name: "Anna",
  client_email: "anna@example.com",
  therapist_name: "Maria",
};
const EMAIL_DATA = {
  type: "thai",
  duration: 60,
  date: "2026-10-20",
  time: "14:00",
  clientName: "Anna",
  clientEmail: "anna@example.com",
  therapistName: "Maria",
};
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
  mocks.sql.mockResolvedValue([{ id: "booking-1", ...PEOPLE }]);
  mocks.sendEmail.mockResolvedValue({});
  mocks.sendCreatedEmail.mockResolvedValue({});
  mocks.sendConfirmedEmail.mockResolvedValue({});
  mocks.sendUpdatedEmail.mockResolvedValue({});
  mocks.sendUpdatedClientEmail.mockResolvedValue({});
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

  it("inserts the booking with its end time and notifies both sides", async () => {
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
    expect(mocks.sendEmail).toHaveBeenCalledWith(EMAIL_DATA);
    expect(mocks.sendCreatedEmail).toHaveBeenCalledWith(EMAIL_DATA);
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
    mocks.sendEmail.mockRejectedValue(new Error("smtp down"));

    await expect(createBooking("user-1", BOOKING)).resolves.toEqual(
      expect.any(String),
    );
    expect(mocks.sendCreatedEmail).toHaveBeenCalled();
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

  it("notifies the therapist and the booking owner", async () => {
    await updateBooking("booking-1", BOOKING);

    expect(mocks.sendUpdatedEmail).toHaveBeenCalledWith(EMAIL_DATA);
    expect(mocks.sendUpdatedClientEmail).toHaveBeenCalledWith(EMAIL_DATA);
    expect(mocks.sendEmail).not.toHaveBeenCalled();
    expect(mocks.sendCreatedEmail).not.toHaveBeenCalled();
  });

  it("reports a taken slot when the overlap constraint fires", async () => {
    mocks.sql.mockRejectedValue(exclusionViolation());
    await expectApiError(updateBooking("booking-1", BOOKING), 409);
  });

  it("reports a missing booking", async () => {
    mocks.sql.mockResolvedValue([]);
    await expectApiError(updateBooking("booking-1", BOOKING), 404);
    expect(mocks.sendUpdatedEmail).not.toHaveBeenCalled();
    expect(mocks.sendUpdatedClientEmail).not.toHaveBeenCalled();
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
  beforeEach(() => {
    mocks.sql.mockResolvedValue([
      {
        massage_type: "thai",
        duration: 60,
        date: new Date("2026-10-20T14:00:00Z"),
        ...PEOPLE,
      },
    ]);
  });

  it("updates the status", async () => {
    await setBookingStatus("booking-1", "completed");
    expect(lastQueryValues()).toEqual(
      expect.arrayContaining(["completed", "booking-1"]),
    );
    expect(mocks.sendConfirmedEmail).not.toHaveBeenCalled();
  });

  it("emails the client when the booking is confirmed", async () => {
    await setBookingStatus("booking-1", "confirmed");

    expect(mocks.sendConfirmedEmail).toHaveBeenCalledWith(EMAIL_DATA);
  });

  it("still confirms when the email fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.sendConfirmedEmail.mockRejectedValue(new Error("smtp down"));

    await expect(
      setBookingStatus("booking-1", "confirmed"),
    ).resolves.toBeUndefined();
  });

  it("reports a missing booking", async () => {
    mocks.sql.mockResolvedValue([]);
    await expectApiError(setBookingStatus("booking-1", "confirmed"), 404);
    expect(mocks.sendConfirmedEmail).not.toHaveBeenCalled();
  });
});
