// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sqlMock = vi.hoisted(() => vi.fn());
vi.mock("@/app/lib/db", () => ({
  sql: (strings: TemplateStringsArray, ...values: unknown[]) =>
    sqlMock(strings, ...values),
}));

import {
  getAvailableSlots,
  isSlotAvailable,
} from "@/app/lib/data/availability";

const THERAPIST = "e67190e7-db41-4612-9963-6ada87745747";
// "Now" is 09:00 on 2026-10-19 in the salon (12:00 UTC)
const NOW = new Date("2026-10-19T12:00:00Z");
const TOMORROW = "2026-10-20";

type Range = [string, string];

function mockDatabase({
  schedule,
  busy = [],
}: {
  schedule: Range[];
  busy?: { starts_at: string; ends_at: string }[];
}) {
  sqlMock.mockImplementation((strings: TemplateStringsArray) => {
    const query = strings.join("?");
    if (query.includes("therapist_schedules")) {
      return Promise.resolve(
        schedule.map(([start, end]) => ({
          start_time: `${start}:00`,
          end_time: `${end}:00`,
        })),
      );
    }
    return Promise.resolve(
      busy.map((b) => ({
        starts_at: new Date(b.starts_at),
        ends_at: new Date(b.ends_at),
      })),
    );
  });
}

describe("getAvailableSlots", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(NOW);
    sqlMock.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 30-minute starts that fit the session into working hours", async () => {
    mockDatabase({ schedule: [["09:00", "11:00"]] });

    await expect(
      getAvailableSlots({
        therapistId: THERAPIST,
        date: TOMORROW,
        duration: 60,
      }),
    ).resolves.toEqual(["09:00", "09:30", "10:00"]);
  });

  it("skips starts that overlap an existing booking", async () => {
    mockDatabase({
      schedule: [["09:00", "12:00"]],
      busy: [
        { starts_at: "2026-10-20T10:00:00Z", ends_at: "2026-10-20T11:00:00Z" },
      ],
    });

    await expect(
      getAvailableSlots({
        therapistId: THERAPIST,
        date: TOMORROW,
        duration: 60,
      }),
    ).resolves.toEqual(["09:00", "11:00"]);
  });

  it("allows sessions that touch a booking without overlapping", async () => {
    mockDatabase({
      schedule: [["09:00", "10:30"]],
      busy: [
        { starts_at: "2026-10-20T09:30:00Z", ends_at: "2026-10-20T10:00:00Z" },
      ],
    });

    await expect(
      getAvailableSlots({
        therapistId: THERAPIST,
        date: TOMORROW,
        duration: 30,
      }),
    ).resolves.toEqual(["09:00", "10:00"]);
  });

  it("supports split shifts", async () => {
    mockDatabase({
      schedule: [
        ["09:00", "10:00"],
        ["14:00", "15:00"],
      ],
    });

    await expect(
      getAvailableSlots({
        therapistId: THERAPIST,
        date: TOMORROW,
        duration: 30,
      }),
    ).resolves.toEqual(["09:00", "09:30", "14:00", "14:30"]);
  });

  it("hides slots that already started today", async () => {
    mockDatabase({ schedule: [["08:00", "11:00"]] });

    await expect(
      getAvailableSlots({
        therapistId: THERAPIST,
        date: "2026-10-19",
        duration: 30,
      }),
    ).resolves.toEqual(["09:30", "10:00", "10:30"]);
  });

  it("returns nothing on a day off", async () => {
    mockDatabase({ schedule: [] });

    await expect(
      getAvailableSlots({
        therapistId: THERAPIST,
        date: TOMORROW,
        duration: 30,
      }),
    ).resolves.toEqual([]);
  });

  it("does not query the database outside the booking window", async () => {
    mockDatabase({ schedule: [["09:00", "18:00"]] });

    await expect(
      getAvailableSlots({
        therapistId: THERAPIST,
        date: "2026-10-18",
        duration: 30,
      }),
    ).resolves.toEqual([]);
    await expect(
      getAvailableSlots({
        therapistId: THERAPIST,
        date: "2026-11-03",
        duration: 30,
      }),
    ).resolves.toEqual([]);
    expect(sqlMock).not.toHaveBeenCalled();
  });

  it("passes the booking being edited so it does not block itself", async () => {
    mockDatabase({ schedule: [["09:00", "10:00"]] });

    await getAvailableSlots({
      therapistId: THERAPIST,
      date: TOMORROW,
      duration: 30,
      excludeBookingId: "booking-1",
    });
    await getAvailableSlots({
      therapistId: THERAPIST,
      date: TOMORROW,
      duration: 30,
    });

    const busyCalls = sqlMock.mock.calls.filter(([strings]) =>
      strings.join("?").includes("FROM bookings"),
    );
    expect(busyCalls[0]).toContain("booking-1");
    expect(busyCalls[1]).toContain(null);
  });
});

describe("isSlotAvailable", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(NOW);
    mockDatabase({ schedule: [["09:00", "10:00"]] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("checks the time against the free slots", async () => {
    const query = { therapistId: THERAPIST, date: TOMORROW, duration: 30 };
    await expect(isSlotAvailable({ ...query, time: "09:30" })).resolves.toBe(
      true,
    );
    await expect(isSlotAvailable({ ...query, time: "10:00" })).resolves.toBe(
      false,
    );
  });
});
