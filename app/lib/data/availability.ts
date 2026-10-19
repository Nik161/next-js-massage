import { sql } from "@/app/lib/db";
import {
  getMaxBookingDate,
  getToday,
  salonNow,
  SLOT_STEP_MINUTES,
  toBookingDateTime,
  toSlotTime,
} from "@/app/lib/booking_time";

const MINUTE_MS = 60_000;

export type SlotQuery = {
  therapistId: string;
  // "YYYY-MM-DD"
  date: string;
  // Minutes
  duration: number;
  // When editing, the booking itself must not block its own time.
  excludeBookingId?: string;
};

type Interval = { starts_at: Date; ends_at: Date };

function fetchWorkingHours(therapistId: string, date: string) {
  return sql<{ start_time: string; end_time: string }[]>`
    SELECT start_time, end_time
    FROM therapist_schedules
    WHERE therapist_id = ${therapistId}
      AND weekday = EXTRACT(DOW FROM ${date}::date)
    ORDER BY start_time
  `;
}

// Active bookings and time off that touch the given day
function fetchBusyIntervals(
  therapistId: string,
  dayStart: Date,
  dayEnd: Date,
  excludeBookingId: string | null,
) {
  return sql<Interval[]>`
    SELECT date AS starts_at, ends_at
    FROM bookings
    WHERE therapist_id = ${therapistId}
      AND status <> 'canceled'
      AND date < ${dayEnd}
      AND ends_at > ${dayStart}
      AND id IS DISTINCT FROM ${excludeBookingId}::uuid
    UNION ALL
    SELECT starts_at, ends_at
    FROM therapist_time_off
    WHERE therapist_id = ${therapistId}
      AND starts_at < ${dayEnd}
      AND ends_at > ${dayStart}
  `;
}

// Free start times ("HH:MM") for a therapist on a day, for a session of `duration` minutes.
export async function getAvailableSlots({
  therapistId,
  date,
  duration,
  excludeBookingId,
}: SlotQuery): Promise<string[]> {
  if (date < getToday() || date > getMaxBookingDate()) return [];

  const dayStart = toBookingDateTime(date, "00:00");
  const dayEnd = new Date(dayStart.getTime() + 24 * 60 * MINUTE_MS);

  const [workingHours, busy] = await Promise.all([
    fetchWorkingHours(therapistId, date),
    fetchBusyIntervals(therapistId, dayStart, dayEnd, excludeBookingId ?? null),
  ]);

  const now = salonNow().getTime();
  const durationMs = duration * MINUTE_MS;
  const slots: string[] = [];

  for (const { start_time, end_time } of workingHours) {
    const workStart = toBookingDateTime(date, start_time.slice(0, 5)).getTime();
    const workEnd = toBookingDateTime(date, end_time.slice(0, 5)).getTime();

    for (
      let start = workStart;
      start + durationMs <= workEnd;
      start += SLOT_STEP_MINUTES * MINUTE_MS
    ) {
      const end = start + durationMs;
      const isBusy = busy.some(
        (interval) =>
          start < interval.ends_at.getTime() &&
          end > interval.starts_at.getTime(),
      );

      if (start > now && !isBusy) {
        slots.push(toSlotTime(new Date(start)));
      }
    }
  }

  return slots;
}

export async function isSlotAvailable(query: SlotQuery & { time: string }) {
  const slots = await getAvailableSlots(query);
  return slots.includes(query.time);
}
