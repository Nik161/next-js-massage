import postgres from "postgres";
import { z } from "zod";
import { sql } from "@/app/lib/db";
import { ApiError } from "@/app/lib/api/http";
import { isSlotAvailable } from "@/app/lib/data/availability";
import { toBookingDateTime } from "@/app/lib/booking_time";
import { MASSAGE_DURATIONS } from "@/app/constants/massage_durations";
import { sendBookingEmailToTherapist } from "@/app/lib/email/booking_email";
import type { ManualBookingStatus } from "@/app/lib/definitions";

export const SLOT_TAKEN_MESSAGE = "Это время уже занято, выберите другое.";

// Postgres error code for a violated exclusion constraint (bookings_no_overlap)
const EXCLUSION_VIOLATION = "23P01";

export const BookingInputSchema = z.object({
  massage_type: z
    .string({ message: "Please select a massage type." })
    .min(1, { message: "Please select a massage type." }),
  duration: z.coerce
    .number({ message: "Please enter a valid number." })
    .refine((value) => MASSAGE_DURATIONS.includes(value), {
      message: "Please select a valid duration.",
    }),
  date: z.iso.date({ message: "Please select a date." }),
  time: z
    .string({ message: "Please select a time." })
    .regex(/^\d{2}:\d{2}$/, { message: "Please select a time." }),
  therapist_id: z.uuid({ message: "Please select a therapist." }),
});

export type BookingInput = z.infer<typeof BookingInputSchema>;

export const BookingStatusInputSchema = z.object({
  status: z.enum(["confirmed", "completed"] satisfies ManualBookingStatus[]),
});

function getBookingInterval({ date, time, duration }: BookingInput) {
  const startsAt = toBookingDateTime(date, time);
  const endsAt = new Date(startsAt.getTime() + duration * 60_000);
  return { startsAt, endsAt };
}

// Friendly early check; the bookings_no_overlap constraint is the real guarantee.
async function assertSlotAvailable(
  booking: BookingInput,
  excludeBookingId?: string,
) {
  const available = await isSlotAvailable({
    therapistId: booking.therapist_id,
    date: booking.date,
    time: booking.time,
    duration: booking.duration,
    excludeBookingId,
  });
  if (!available) throw new ApiError(409, SLOT_TAKEN_MESSAGE);
}

function isSlotTakenError(error: unknown) {
  return (
    error instanceof postgres.PostgresError &&
    error.code === EXCLUSION_VIOLATION
  );
}

// Turns the overlap constraint into a 409, everything else stays a 500.
async function writeBooking<T>(query: () => Promise<T>) {
  try {
    return await query();
  } catch (error) {
    if (isSlotTakenError(error)) throw new ApiError(409, SLOT_TAKEN_MESSAGE);
    throw error;
  }
}

function assertFound(rows: unknown[]) {
  if (rows.length === 0) throw new ApiError(404, "Booking not found");
}

// The email is a nice-to-have: a failure must not break the booking itself.
async function notifyTherapist(booking: BookingInput) {
  try {
    await sendBookingEmailToTherapist({
      type: booking.massage_type,
      duration: booking.duration,
      date: booking.date,
      time: booking.time,
    });
  } catch (error) {
    console.error("Failed to send booking email:", error);
  }
}

export async function createBooking(userId: string, booking: BookingInput) {
  await assertSlotAvailable(booking);

  const { startsAt, endsAt } = getBookingInterval(booking);
  const id = crypto.randomUUID();

  await writeBooking(
    () => sql`
      INSERT INTO bookings (id, massage_type, duration, status, date, ends_at, is_social, user_id, therapist_id)
      VALUES (
        ${id},
        ${booking.massage_type},
        ${booking.duration},
        ${"booked"},
        ${startsAt},
        ${endsAt},
        ${true},
        ${userId},
        ${booking.therapist_id}
      )
    `,
  );

  await notifyTherapist(booking);
  return id;
}

export async function updateBooking(id: string, booking: BookingInput) {
  await assertSlotAvailable(booking, id);

  const { startsAt, endsAt } = getBookingInterval(booking);

  const rows = await writeBooking(
    () => sql`
      UPDATE bookings
      SET
        massage_type = ${booking.massage_type},
        duration = ${booking.duration},
        date = ${startsAt},
        ends_at = ${endsAt},
        therapist_id = ${booking.therapist_id}
      WHERE id = ${id}
      RETURNING id
    `,
  );
  assertFound(rows);

  await notifyTherapist(booking);
}

export async function deleteBooking(id: string) {
  const rows = await sql`DELETE FROM bookings WHERE id = ${id} RETURNING id`;
  assertFound(rows);
}

export async function setBookingStatus(
  id: string,
  status: ManualBookingStatus,
) {
  const rows = await sql`
    UPDATE bookings
    SET status = ${status}
    WHERE id = ${id}
    RETURNING id
  `;
  assertFound(rows);
}
