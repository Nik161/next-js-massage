import postgres from "postgres";
import { z } from "zod";
import { sql } from "@/app/lib/db";
import { ApiError } from "@/app/lib/api/http";
import { isSlotAvailable } from "@/app/lib/data/availability";
import { toBookingDateTime, toSlotTime } from "@/app/lib/booking_time";
import { MASSAGE_DURATIONS } from "@/app/constants/massage_durations";
import {
  type BookingEmailData,
  sendBookingConfirmedEmailToClient,
  sendBookingCreatedEmailToClient,
  sendBookingEmailToTherapist,
  sendBookingUpdatedEmailToClient,
  sendBookingUpdatedEmailToTherapist,
} from "@/app/lib/email/booking_email";
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

// Who a booking email is about, read back right after the write.
type BookingPeople = {
  client_name: string;
  client_email: string;
  therapist_name: string | null;
};

// Selects the rows of the `changed` CTE together with their client and therapist.
function withPeople() {
  return sql`
    SELECT
      changed.*,
      users.name AS client_name,
      users.email AS client_email,
      therapists.name AS therapist_name
    FROM changed
      JOIN users ON users.id = changed.user_id
      LEFT JOIN therapists ON therapists.id = changed.therapist_id
  `;
}

function toEmailData(
  booking: BookingInput,
  people: BookingPeople,
): BookingEmailData {
  return {
    type: booking.massage_type,
    duration: booking.duration,
    date: booking.date,
    time: booking.time,
    clientName: people.client_name,
    clientEmail: people.client_email,
    therapistName: people.therapist_name,
  };
}

// Emails are a nice-to-have: a failure must not break the booking itself.
async function notify(
  send: (booking: BookingEmailData) => Promise<unknown>,
  booking: BookingEmailData,
) {
  try {
    await send(booking);
  } catch (error) {
    console.error(`Failed to send booking email (${send.name}):`, error);
  }
}

export async function createBooking(userId: string, booking: BookingInput) {
  await assertSlotAvailable(booking);

  const { startsAt, endsAt } = getBookingInterval(booking);
  const id = crypto.randomUUID();

  const rows = await writeBooking(
    () => sql<BookingPeople[]>`
      WITH changed AS (
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
        RETURNING user_id, therapist_id
      )
      ${withPeople()}
    `,
  );

  const emailData = toEmailData(booking, rows[0]);
  await Promise.all([
    notify(sendBookingEmailToTherapist, emailData),
    notify(sendBookingCreatedEmailToClient, emailData),
  ]);
  return id;
}

export async function updateBooking(id: string, booking: BookingInput) {
  await assertSlotAvailable(booking, id);

  const { startsAt, endsAt } = getBookingInterval(booking);

  const rows = await writeBooking(
    () => sql<BookingPeople[]>`
      WITH changed AS (
        UPDATE bookings
        SET
          massage_type = ${booking.massage_type},
          duration = ${booking.duration},
          date = ${startsAt},
          ends_at = ${endsAt},
          therapist_id = ${booking.therapist_id}
        WHERE id = ${id}
        RETURNING user_id, therapist_id
      )
      ${withPeople()}
    `,
  );
  assertFound(rows);

  const emailData = toEmailData(booking, rows[0]);
  await Promise.all([
    notify(sendBookingUpdatedEmailToTherapist, emailData),
    notify(sendBookingUpdatedEmailToClient, emailData),
  ]);
}

export async function deleteBooking(id: string) {
  const rows = await sql`DELETE FROM bookings WHERE id = ${id} RETURNING id`;
  assertFound(rows);
}

type StatusUpdateRow = BookingPeople & {
  massage_type: string;
  duration: number;
  date: Date;
};

export async function setBookingStatus(
  id: string,
  status: ManualBookingStatus,
) {
  const rows = await sql<StatusUpdateRow[]>`
    WITH changed AS (
      UPDATE bookings
      SET status = ${status}
      WHERE id = ${id}
      RETURNING user_id, therapist_id, massage_type, duration, date
    )
    ${withPeople()}
  `;
  assertFound(rows);

  if (status === "confirmed") {
    const [row] = rows;
    await notify(sendBookingConfirmedEmailToClient, {
      type: row.massage_type,
      duration: row.duration,
      date: row.date.toISOString().slice(0, 10),
      time: toSlotTime(row.date),
      clientName: row.client_name,
      clientEmail: row.client_email,
      therapistName: row.therapist_name,
    });
  }
}
