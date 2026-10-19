// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  getAvailableSlots: vi.fn(),
}));
vi.mock("@/auth", () => ({ auth: mocks.auth }));
vi.mock("@/app/lib/data/availability", () => ({
  getAvailableSlots: mocks.getAvailableSlots,
}));

import { GET } from "@/app/api/massage_slots/route";

const THERAPIST = "e67190e7-db41-4612-9963-6ada87745747";
const BOOKING = "17a132f6-59a9-4b57-b004-a1f166bd491e";

function request(params: Record<string, string>) {
  const url = new URL("http://localhost/api/massage_slots");
  for (const [key, value] of Object.entries(params))
    url.searchParams.set(key, value);
  return new NextRequest(url);
}

const VALID = { therapistId: THERAPIST, date: "2026-10-20", duration: "60" };

describe("GET /api/massage_slots", () => {
  beforeEach(() => {
    mocks.auth.mockResolvedValue({ user: { id: "user-1" } });
    mocks.getAvailableSlots.mockResolvedValue(["09:00", "09:30"]);
  });

  it("rejects anonymous requests", async () => {
    mocks.auth.mockResolvedValue(null);
    const response = await GET(request(VALID));
    expect(response.status).toBe(401);
    expect(mocks.getAvailableSlots).not.toHaveBeenCalled();
  });

  it.each([
    ["a malformed therapist id", { ...VALID, therapistId: "nope" }],
    ["a malformed date", { ...VALID, date: "20-10-2026" }],
    ["an unsupported duration", { ...VALID, duration: "45" }],
    ["a missing parameter", { therapistId: THERAPIST, date: "2026-10-20" }],
  ])("rejects %s", async (_, params) => {
    const response = await GET(request(params));
    expect(response.status).toBe(400);
  });

  it("returns the free slots", async () => {
    const response = await GET(request(VALID));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      slots: ["09:00", "09:30"],
    });
    expect(mocks.getAvailableSlots).toHaveBeenCalledWith({
      therapistId: THERAPIST,
      date: "2026-10-20",
      duration: 60,
    });
  });

  it("forwards the booking being edited", async () => {
    await GET(request({ ...VALID, excludeBookingId: BOOKING }));
    expect(mocks.getAvailableSlots).toHaveBeenCalledWith(
      expect.objectContaining({ excludeBookingId: BOOKING }),
    );
  });

  it("hides internal errors", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.getAvailableSlots.mockRejectedValue(new Error("db down"));

    const response = await GET(request(VALID));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Failed to get slots",
    });
  });
});
