import { describe, expect, it } from "vitest";
import { canEditBooking, isAdmin } from "@/app/lib/permissions";

describe("permissions", () => {
  it("recognises admins", () => {
    expect(isAdmin({ role: "admin" })).toBe(true);
    expect(isAdmin({ role: "user" })).toBe(false);
    expect(isAdmin(undefined)).toBe(false);
    expect(isAdmin(null)).toBe(false);
  });

  it("lets only admins edit bookings", () => {
    expect(canEditBooking({ role: "admin" })).toBe(true);
    expect(canEditBooking({ role: "user" })).toBe(false);
    expect(canEditBooking(undefined)).toBe(false);
  });
});
