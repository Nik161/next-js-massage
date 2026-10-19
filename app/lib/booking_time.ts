// Booking times are salon wall-clock times. They are stored with a +00:00
// offset (e.g. 14:00 at the salon is saved as 14:00Z), so "now" must also be
// taken as the salon's wall-clock time before comparing.
export const SALON_TIME_ZONE = "Europe/Berlin";

export const BOOKING_WINDOW_DAYS = 14;

export const SLOT_STEP_MINUTES = 30;

// "YYYY-MM-DD" + "HH:MM" -> Date in the storage convention
export function toBookingDateTime(date: string, time: string) {
  return new Date(`${date}T${time}:00Z`);
}

// "HH:MM" from a Date in the storage convention
export function toSlotTime(date: Date) {
  return date.toISOString().slice(11, 16);
}

// Current salon wall-clock time in the storage convention
export function salonNow() {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: SALON_TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date())
      .map((part) => [part.type, part.value]),
  );

  return new Date(
    `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}Z`,
  );
}

// "YYYY-MM-DD" in the salon time zone, the format used by <input type="date">
export function getToday() {
  return salonNow().toISOString().slice(0, 10);
}

export function getMaxBookingDate() {
  const date = salonNow();
  date.setUTCDate(date.getUTCDate() + BOOKING_WINDOW_DAYS);
  return date.toISOString().slice(0, 10);
}
