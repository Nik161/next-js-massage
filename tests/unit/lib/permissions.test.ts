import { describe, expect, it } from "vitest";
import {
  bookingsOwnerFilter,
  canEditBooking,
  isAdmin,
} from "@/app/lib/permissions";

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

  it("limits regular users to their own bookings", () => {
    expect(bookingsOwnerFilter({ id: "u-1", role: "user" })).toBe("u-1");
    expect(bookingsOwnerFilter({ id: "a-1", role: "admin" })).toBeNull();
  });
});
