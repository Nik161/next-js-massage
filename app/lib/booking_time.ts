// Booking times are salon wall-clock times. They are stored with a +00:00
// offset (e.g. 14:00 at the salon is saved as 14:00Z), so "now" must also be
// taken as the salon's wall-clock time before comparing.
// Florianópolis, Santa Catarina (UTC-3, no DST)
export const SALON_TIME_ZONE = "America/Sao_Paulo";

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

// Dates are formatted in UTC because of the storage convention above.
const dayFormat = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("ru-RU", { timeZone: "UTC", ...options });

const weekdayFormat = dayFormat({ weekday: "short" });
const monthFormat = dayFormat({ month: "short" });
const longDateFormat = dayFormat({
  weekday: "long",
  day: "numeric",
  month: "long",
});

function parseDay(date: string) {
  return new Date(`${date}T00:00:00Z`);
}

// Every bookable day from today to the end of the booking window
export function getBookingDays() {
  const days: string[] = [];
  const day = parseDay(getToday());
  for (let i = 0; i <= BOOKING_WINDOW_DAYS; i++) {
    days.push(day.toISOString().slice(0, 10));
    day.setUTCDate(day.getUTCDate() + 1);
  }
  return days;
}

// { weekday: "пн", day: 20, month: "окт." }
export function formatDayParts(date: string) {
  const day = parseDay(date);
  return {
    weekday: weekdayFormat.format(day),
    day: day.getUTCDate(),
    month: monthFormat.format(day),
  };
}

// "понедельник, 20 октября"
export function formatLongDate(date: string) {
  return longDateFormat.format(parseDay(date));
}
