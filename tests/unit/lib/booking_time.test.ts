import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  BOOKING_WINDOW_DAYS,
  formatDayParts,
  formatLongDate,
  getBookingDays,
  getMaxBookingDate,
  getToday,
  salonNow,
  toBookingDateTime,
  toSlotTime,
} from "@/app/lib/booking_time";

// The salon is in America/Sao_Paulo (UTC-3, no DST)
describe("booking_time", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("stores salon wall-clock time with a UTC offset of zero", () => {
    expect(toBookingDateTime("2026-10-20", "14:30").toISOString()).toBe(
      "2026-10-20T14:30:00.000Z",
    );
  });

  it("formats a stored date back to HH:MM", () => {
    expect(toSlotTime(new Date("2026-10-20T09:05:00Z"))).toBe("09:05");
  });

  it("returns the current salon wall-clock time", () => {
    vi.setSystemTime(new Date("2026-10-20T12:00:00Z"));
    expect(salonNow().toISOString()).toBe("2026-10-20T09:00:00.000Z");
  });

  it("uses the salon date, not the UTC date, for today", () => {
    // 02:00 UTC on the 21st is still 23:00 on the 20th in Florianópolis
    vi.setSystemTime(new Date("2026-10-21T02:00:00Z"));
    expect(getToday()).toBe("2026-10-20");
  });

  it("ends the booking window two weeks after today", () => {
    vi.setSystemTime(new Date("2026-10-20T12:00:00Z"));
    expect(getMaxBookingDate()).toBe("2026-11-03");
  });

  it("lists every bookable day across a month boundary", () => {
    vi.setSystemTime(new Date("2026-10-25T12:00:00Z"));
    const days = getBookingDays();

    expect(days).toHaveLength(BOOKING_WINDOW_DAYS + 1);
    expect(days[0]).toBe("2026-10-25");
    expect(days).toContain("2026-11-01");
    expect(days.at(-1)).toBe(getMaxBookingDate());
  });

  it("formats day parts in Russian", () => {
    expect(formatDayParts("2026-10-19")).toEqual({
      weekday: "пн",
      day: 19,
      month: "окт.",
    });
  });

  it("formats a long Russian date", () => {
    expect(formatLongDate("2026-10-19")).toBe("понедельник, 19 октября");
  });
});
