// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import postgres from "postgres";

const mocks = vi.hoisted(() => ({
  sql: vi.fn(),
  revalidatePath: vi.fn(),
  redirect: vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  }),
  signIn: vi.fn(),
  getCurrentUser: vi.fn(),
  requireUserId: vi.fn(),
  isSlotAvailable: vi.fn(),
  sendEmail: vi.fn(),
}));

vi.mock("@/app/lib/db", () => ({ sql: mocks.sql }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("@/auth", () => ({ signIn: mocks.signIn }));
vi.mock("next-auth", () => ({
  AuthError: class AuthError extends Error {
    constructor(public type: string) {
      super(type);
    }
  },
}));
vi.mock("@/app/lib/session", () => ({
  getCurrentUser: mocks.getCurrentUser,
  requireUserId: mocks.requireUserId,
}));
vi.mock("@/app/lib/data/availability", () => ({
  isSlotAvailable: mocks.isSlotAvailable,
}));
vi.mock("@/app/lib/email/booking_email", () => ({
  sendBookingEmailToTherapist: mocks.sendEmail,
}));

import { AuthError } from "next-auth";
import {
  authenticate,
  createBooking,
  deleteBooking,
  setBookingStatus,
  updateBooking,
} from "@/app/lib/actions";

const THERAPIST = "e67190e7-db41-4612-9963-6ada87745747";
const EMPTY_STATE = { message: null, errors: {} };
const ADMIN = { id: "admin-1", role: "admin" };
const CLIENT = { id: "user-1", role: "user" };

function bookingForm(overrides: Record<string, string> = {}) {
  const form = new FormData();
  const values = {
    therapist_id: THERAPIST,
    booking_date: "2026-10-20",
    booking_time: "14:00",
    massage_type: "thai",
    booking_duration: "60",
    ...overrides,
  };
  for (const [key, value] of Object.entries(values)) form.set(key, value);
  return form;
}

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

beforeEach(() => {
  for (const mock of Object.values(mocks)) mock.mockReset();
  mocks.redirect.mockImplementation(() => {
    throw new Error("NEXT_REDIRECT");
  });
  mocks.requireUserId.mockResolvedValue("user-1");
  mocks.isSlotAvailable.mockResolvedValue(true);
  mocks.sql.mockResolvedValue([]);
  mocks.sendEmail.mockResolvedValue({});
});

describe("createBooking", () => {
  it("returns field errors for invalid input without touching the database", async () => {
    const result = await createBooking(
      EMPTY_STATE,
      bookingForm({
        booking_time: "",
        booking_duration: "45",
        therapist_id: "x",
      }),
    );

    expect(result.message).toMatch(/Missing Fields/);
    expect(Object.keys(result.errors)).toEqual(
      expect.arrayContaining(["time", "duration", "therapist_id"]),
    );
    expect(mocks.sql).not.toHaveBeenCalled();
  });

  it("requires a signed-in user", async () => {
    mocks.requireUserId.mockRejectedValue(new Error("Unauthorized"));
    await expect(createBooking(EMPTY_STATE, bookingForm())).rejects.toThrow(
      "Unauthorized",
    );
  });

  it("refuses a slot that is no longer free", async () => {
    mocks.isSlotAvailable.mockResolvedValue(false);

    const result = await createBooking(EMPTY_STATE, bookingForm());

    expect(result.message).toBe("Это время уже занято, выберите другое.");
    expect(mocks.sql).not.toHaveBeenCalled();
  });

  it("inserts the booking with its end time, notifies and redirects", async () => {
    await expect(createBooking(EMPTY_STATE, bookingForm())).rejects.toThrow(
      "NEXT_REDIRECT",
    );

    expect(mocks.isSlotAvailable).toHaveBeenCalledWith({
      therapistId: THERAPIST,
      date: "2026-10-20",
      time: "14:00",
      duration: 60,
      excludeBookingId: undefined,
    });
    const values = lastQueryValues();
    expect(values).toContainEqual(new Date("2026-10-20T14:00:00Z"));
    expect(values).toContainEqual(new Date("2026-10-20T15:00:00Z"));
    expect(values).toContain("user-1");
    expect(values).toContain("booked");
    expect(mocks.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "thai",
        date: "2026-10-20",
        time: "14:00",
      }),
    );
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/bookings");
    expect(mocks.redirect).toHaveBeenCalledWith("/bookings");
  });

  it("reports a taken slot when the overlap constraint fires", async () => {
    mocks.sql.mockRejectedValue(exclusionViolation());

    const result = await createBooking(EMPTY_STATE, bookingForm());

    expect(result.message).toBe("Это время уже занято, выберите другое.");
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it("reports other database errors", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.sql.mockRejectedValue(new Error("connection lost"));

    const result = await createBooking(EMPTY_STATE, bookingForm());

    expect(result.message).toBe("Database Error: Failed to Create Booking.");
  });

  it("still books when the email fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.sendEmail.mockRejectedValue(new Error("resend down"));

    await expect(createBooking(EMPTY_STATE, bookingForm())).rejects.toThrow(
      "NEXT_REDIRECT",
    );
    expect(mocks.redirect).toHaveBeenCalledWith("/bookings");
  });
});

describe("updateBooking", () => {
  it("is admin only", async () => {
    mocks.getCurrentUser.mockResolvedValue(CLIENT);
    await expect(
      updateBooking("booking-1", EMPTY_STATE, bookingForm()),
    ).rejects.toThrow("Unauthorized");
    expect(mocks.sql).not.toHaveBeenCalled();
  });

  it("does not let the booking block its own slot", async () => {
    mocks.getCurrentUser.mockResolvedValue(ADMIN);

    await expect(
      updateBooking("booking-1", EMPTY_STATE, bookingForm()),
    ).rejects.toThrow("NEXT_REDIRECT");

    expect(mocks.isSlotAvailable).toHaveBeenCalledWith(
      expect.objectContaining({ excludeBookingId: "booking-1" }),
    );
    expect(lastQueryValues()).toContain("booking-1");
  });

  it("reports a taken slot when the overlap constraint fires", async () => {
    mocks.getCurrentUser.mockResolvedValue(ADMIN);
    mocks.sql.mockRejectedValue(exclusionViolation());

    const result = await updateBooking("booking-1", EMPTY_STATE, bookingForm());

    expect(result.message).toBe("Это время уже занято, выберите другое.");
  });
});

describe("deleteBooking", () => {
  it("is admin only", async () => {
    mocks.getCurrentUser.mockResolvedValue(CLIENT);
    await expect(deleteBooking("booking-1")).rejects.toThrow("Unauthorized");
    expect(mocks.sql).not.toHaveBeenCalled();
  });

  it("deletes and revalidates the list", async () => {
    mocks.getCurrentUser.mockResolvedValue(ADMIN);
    await deleteBooking("booking-1");
    expect(lastQueryValues()).toEqual(["booking-1"]);
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/bookings");
  });
});

describe("setBookingStatus", () => {
  it("is admin only", async () => {
    mocks.getCurrentUser.mockResolvedValue(undefined);
    await expect(setBookingStatus("booking-1", "confirmed")).rejects.toThrow(
      "Unauthorized",
    );
  });

  it("updates the status", async () => {
    mocks.getCurrentUser.mockResolvedValue(ADMIN);
    await setBookingStatus("booking-1", "completed");
    expect(lastQueryValues()).toEqual(["completed", "booking-1"]);
  });
});

describe("authenticate", () => {
  it("maps wrong credentials to a message", async () => {
    mocks.signIn.mockRejectedValue(new AuthError("CredentialsSignin"));
    await expect(authenticate(undefined, new FormData())).resolves.toBe(
      "Invalid credentials.",
    );
  });

  it("maps other auth errors to a generic message", async () => {
    mocks.signIn.mockRejectedValue(new AuthError("Configuration"));
    await expect(authenticate(undefined, new FormData())).resolves.toBe(
      "Something went wrong.",
    );
  });

  it("rethrows everything else (e.g. the redirect after sign-in)", async () => {
    mocks.signIn.mockRejectedValue(new Error("NEXT_REDIRECT"));
    await expect(authenticate(undefined, new FormData())).rejects.toThrow(
      "NEXT_REDIRECT",
    );
  });
});
