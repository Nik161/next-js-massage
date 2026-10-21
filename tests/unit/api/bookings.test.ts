// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  getRequestUser: vi.fn(),
  revalidatePath: vi.fn(),
  createBooking: vi.fn(),
  updateBooking: vi.fn(),
  deleteBooking: vi.fn(),
  setBookingStatus: vi.fn(),
  fetchBookingById: vi.fn(),
  fetchFilteredBookings: vi.fn(),
  fetchBookingsPages: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("@/app/lib/api/auth", async () => {
  const { ApiError } = await import("@/app/lib/api/http");
  const requireUser = async () => {
    const user = await mocks.getRequestUser();
    if (!user) throw new ApiError(401, "Unauthorized");
    return user;
  };
  return {
    requireUser,
    requireAdmin: async () => {
      const user = await requireUser();
      if (user.role !== "admin") throw new ApiError(403, "Forbidden");
      return user;
    },
  };
});
// The real module is loaded for its schemas; keep its side-effectful imports away.
vi.mock("@/app/lib/db", () => ({ sql: vi.fn() }));
vi.mock("@/app/lib/email/booking_email", () => ({}));
vi.mock("@/app/lib/bookings", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/app/lib/bookings")>()),
  createBooking: mocks.createBooking,
  updateBooking: mocks.updateBooking,
  deleteBooking: mocks.deleteBooking,
  setBookingStatus: mocks.setBookingStatus,
}));
vi.mock("@/app/lib/data/bookings", () => ({
  fetchBookingById: mocks.fetchBookingById,
  fetchFilteredBookings: mocks.fetchFilteredBookings,
  fetchBookingsPages: mocks.fetchBookingsPages,
}));

import { ApiError } from "@/app/lib/api/http";
import * as collection from "@/app/api/bookings/route";
import * as item from "@/app/api/bookings/[id]/route";
import * as status from "@/app/api/bookings/[id]/status/route";

const THERAPIST = "e67190e7-db41-4612-9963-6ada87745747";
const BOOKING_ID = "17a132f6-59a9-4b57-b004-a1f166bd491e";
const ADMIN = { id: "admin-1", role: "admin" };
const CLIENT = { id: "user-1", role: "user" };
const INPUT = {
  therapist_id: THERAPIST,
  date: "2026-10-20",
  time: "14:00",
  massage_type: "thai",
  duration: 60,
};
const BOOKING = { id: BOOKING_ID, ...INPUT };

function request(path: string, init?: { method?: string; body?: unknown }) {
  return new NextRequest(new URL(path, "http://localhost"), {
    method: init?.method ?? "GET",
    body: init?.body === undefined ? undefined : JSON.stringify(init.body),
  });
}

const context = (id = BOOKING_ID) => ({ params: Promise.resolve({ id }) });

beforeEach(() => {
  mocks.getRequestUser.mockResolvedValue(CLIENT);
  mocks.createBooking.mockResolvedValue(BOOKING_ID);
  mocks.fetchBookingById.mockResolvedValue(BOOKING);
  mocks.fetchFilteredBookings.mockResolvedValue([BOOKING]);
  mocks.fetchBookingsPages.mockResolvedValue(3);
});

describe("GET /api/bookings", () => {
  it("rejects anonymous requests", async () => {
    mocks.getRequestUser.mockResolvedValue(undefined);
    const response = await collection.GET(request("/api/bookings"));
    expect(response.status).toBe(401);
  });

  it("returns a page of bookings with the page count", async () => {
    const response = await collection.GET(
      request("/api/bookings?query=thai&page=2"),
    );

    await expect(response.json()).resolves.toEqual({
      bookings: [BOOKING],
      totalPages: 3,
    });
    expect(mocks.fetchFilteredBookings).toHaveBeenCalledWith(
      "thai",
      2,
      "user-1",
    );
    expect(mocks.fetchBookingsPages).toHaveBeenCalledWith("thai", "user-1");
  });

  it("lists every user's bookings for admins", async () => {
    mocks.getRequestUser.mockResolvedValue(ADMIN);

    await collection.GET(request("/api/bookings"));

    expect(mocks.fetchFilteredBookings).toHaveBeenCalledWith("", 1, null);
    expect(mocks.fetchBookingsPages).toHaveBeenCalledWith("", null);
  });

  it("rejects a bad page number", async () => {
    const response = await collection.GET(request("/api/bookings?page=0"));
    expect(response.status).toBe(400);
  });
});

describe("POST /api/bookings", () => {
  it("creates a booking for the current user", async () => {
    const response = await collection.POST(
      request("/api/bookings", { method: "POST", body: INPUT }),
    );

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({ booking: BOOKING });
    expect(mocks.createBooking).toHaveBeenCalledWith("user-1", INPUT);
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/bookings");
  });

  it("returns field errors for invalid input", async () => {
    const response = await collection.POST(
      request("/api/bookings", {
        method: "POST",
        body: { ...INPUT, time: "", duration: 45 },
      }),
    );

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toMatch(/Missing Fields/);
    expect(Object.keys(body.fieldErrors)).toEqual(
      expect.arrayContaining(["time", "duration"]),
    );
    expect(mocks.createBooking).not.toHaveBeenCalled();
  });

  it("rejects a body that is not JSON", async () => {
    const response = await collection.POST(
      new NextRequest("http://localhost/api/bookings", {
        method: "POST",
        body: "nope",
      }),
    );
    expect(response.status).toBe(400);
  });

  it("passes service errors through as their status", async () => {
    mocks.createBooking.mockRejectedValue(new ApiError(409, "taken"));

    const response = await collection.POST(
      request("/api/bookings", { method: "POST", body: INPUT }),
    );

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({ error: "taken" });
  });

  it("hides unexpected errors", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.createBooking.mockRejectedValue(new Error("db down"));

    const response = await collection.POST(
      request("/api/bookings", { method: "POST", body: INPUT }),
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Internal Server Error",
    });
  });
});

describe("/api/bookings/:id", () => {
  it("returns a booking, looked up among the user's own", async () => {
    const response = await item.GET(request("/api/bookings/x"), context());
    await expect(response.json()).resolves.toEqual({ booking: BOOKING });
    expect(mocks.fetchBookingById).toHaveBeenCalledWith(BOOKING_ID, "user-1");
  });

  it("lets admins open any booking", async () => {
    mocks.getRequestUser.mockResolvedValue(ADMIN);
    await item.GET(request("/api/bookings/x"), context());
    expect(mocks.fetchBookingById).toHaveBeenCalledWith(BOOKING_ID, null);
  });

  it("answers 404 for a malformed or unknown id", async () => {
    const malformed = await item.GET(
      request("/api/bookings/x"),
      context("not-a-uuid"),
    );
    expect(malformed.status).toBe(404);

    mocks.fetchBookingById.mockResolvedValue(undefined);
    const unknown = await item.GET(request("/api/bookings/x"), context());
    expect(unknown.status).toBe(404);
  });

  it("lets only admins update", async () => {
    const response = await item.PUT(
      request("/api/bookings/x", { method: "PUT", body: INPUT }),
      context(),
    );
    expect(response.status).toBe(403);
    expect(mocks.updateBooking).not.toHaveBeenCalled();
  });

  it("updates as admin", async () => {
    mocks.getRequestUser.mockResolvedValue(ADMIN);

    const response = await item.PUT(
      request("/api/bookings/x", { method: "PUT", body: INPUT }),
      context(),
    );

    expect(response.status).toBe(200);
    expect(mocks.updateBooking).toHaveBeenCalledWith(BOOKING_ID, INPUT);
  });

  it("lets only admins delete", async () => {
    const response = await item.DELETE(
      request("/api/bookings/x", { method: "DELETE" }),
      context(),
    );
    expect(response.status).toBe(403);
    expect(mocks.deleteBooking).not.toHaveBeenCalled();
  });

  it("deletes as admin", async () => {
    mocks.getRequestUser.mockResolvedValue(ADMIN);

    const response = await item.DELETE(
      request("/api/bookings/x", { method: "DELETE" }),
      context(),
    );

    expect(response.status).toBe(204);
    expect(mocks.deleteBooking).toHaveBeenCalledWith(BOOKING_ID);
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/bookings");
  });
});

describe("PATCH /api/bookings/:id/status", () => {
  it("is admin only", async () => {
    const response = await status.PATCH(
      request("/api/bookings/x/status", {
        method: "PATCH",
        body: { status: "confirmed" },
      }),
      context(),
    );
    expect(response.status).toBe(403);
  });

  it("only accepts manual statuses", async () => {
    mocks.getRequestUser.mockResolvedValue(ADMIN);

    const response = await status.PATCH(
      request("/api/bookings/x/status", {
        method: "PATCH",
        body: { status: "canceled" },
      }),
      context(),
    );

    expect(response.status).toBe(400);
    expect(mocks.setBookingStatus).not.toHaveBeenCalled();
  });

  it("sets the status", async () => {
    mocks.getRequestUser.mockResolvedValue(ADMIN);

    const response = await status.PATCH(
      request("/api/bookings/x/status", {
        method: "PATCH",
        body: { status: "completed" },
      }),
      context(),
    );

    expect(response.status).toBe(204);
    expect(mocks.setBookingStatus).toHaveBeenCalledWith(
      BOOKING_ID,
      "completed",
    );
  });
});
