"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import postgres from "postgres";
import { z } from "zod";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { sql } from "@/app/lib/db";
import { getCurrentUser, requireUserId } from "@/app/lib/session";
import { canEditBooking, isAdmin } from "@/app/lib/permissions";
import { isSlotAvailable } from "@/app/lib/data/availability";
import { toBookingDateTime } from "@/app/lib/booking_time";
import { MASSAGE_DURATIONS } from "@/app/constants/massage_durations";
import {
  type BookingEmailData,
  sendBookingEmailToTherapist,
} from "@/app/lib/email/booking_email";
import type {
  BookingFormState,
  ManualBookingStatus,
} from "@/app/lib/definitions";

const BOOKINGS_PATH = "/bookings";

const SLOT_TAKEN_MESSAGE = "Это время уже занято, выберите другое.";

// Postgres error code for a violated exclusion constraint (bookings_no_overlap)
const EXCLUSION_VIOLATION = "23P01";

const BookingFormSchema = z.object({
  type: z
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

type BookingFormData = z.infer<typeof BookingFormSchema>;

function parseBookingForm(formData: FormData) {
  return BookingFormSchema.safeParse({
    type: formData.get("massage_type"),
    duration: formData.get("booking_duration"),
    date: formData.get("booking_date"),
    time: formData.get("booking_time"),
    therapist_id: formData.get("therapist_id"),
  });
}

function getBookingInterval({ date, time, duration }: BookingFormData) {
  const startsAt = toBookingDateTime(date, time);
  const endsAt = new Date(startsAt.getTime() + duration * 60_000);
  return { startsAt, endsAt };
}

// Friendly early check; the bookings_no_overlap constraint is the real guarantee.
function checkSlot(booking: BookingFormData, excludeBookingId?: string) {
  return isSlotAvailable({
    therapistId: booking.therapist_id,
    date: booking.date,
    time: booking.time,
    duration: booking.duration,
    excludeBookingId,
  });
}

function isSlotTakenError(error: unknown) {
  return (
    error instanceof postgres.PostgresError &&
    error.code === EXCLUSION_VIOLATION
  );
}

async function requireBookingEditor() {
  const user = await getCurrentUser();
  if (!canEditBooking(user)) throw new Error("Unauthorized");
}

// The email is a nice-to-have: a failure must not break the booking itself.
async function notifyTherapist(booking: BookingEmailData) {
  try {
    await sendBookingEmailToTherapist(booking);
  } catch (error) {
    console.error("Failed to send booking email:", error);
  }
}

function returnToBookings(): never {
  revalidatePath(BOOKINGS_PATH);
  redirect(BOOKINGS_PATH);
}

export async function createBooking(
  prevState: BookingFormState,
  formData: FormData,
): Promise<BookingFormState> {
  const userId = await requireUserId();

  const validatedFields = parseBookingForm(formData);
  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
      message: "Missing Fields. Failed to create Booking.",
    };
  }

  const booking = validatedFields.data;
  if (!(await checkSlot(booking))) {
    return { message: SLOT_TAKEN_MESSAGE, errors: {} };
  }

  const { startsAt, endsAt } = getBookingInterval(booking);

  try {
    await sql`
      INSERT INTO bookings (id, massage_type, duration, status, date, ends_at, is_social, user_id, therapist_id)
      VALUES (
        ${crypto.randomUUID()},
        ${booking.type},
        ${booking.duration},
        ${"booked"},
        ${startsAt},
        ${endsAt},
        ${true},
        ${userId},
        ${booking.therapist_id}
      )
    `;
  } catch (error) {
    if (isSlotTakenError(error)) {
      return { message: SLOT_TAKEN_MESSAGE, errors: {} };
    }
    console.error(error);
    return { message: "Database Error: Failed to Create Booking.", errors: {} };
  }

  await notifyTherapist(booking);
  returnToBookings();
}

export async function updateBooking(
  id: string,
  prevState: BookingFormState,
  formData: FormData,
): Promise<BookingFormState> {
  await requireBookingEditor();

  const validatedFields = parseBookingForm(formData);
  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
      message: "Missing Fields. Failed to update Booking.",
    };
  }

  const booking = validatedFields.data;
  if (!(await checkSlot(booking, id))) {
    return { message: SLOT_TAKEN_MESSAGE, errors: {} };
  }

  const { startsAt, endsAt } = getBookingInterval(booking);

  try {
    await sql`
      UPDATE bookings
      SET
        massage_type = ${booking.type},
        duration = ${booking.duration},
        date = ${startsAt},
        ends_at = ${endsAt},
        therapist_id = ${booking.therapist_id}
      WHERE id = ${id}
    `;
  } catch (error) {
    if (isSlotTakenError(error)) {
      return { message: SLOT_TAKEN_MESSAGE, errors: {} };
    }
    console.error(error);
    return { message: "Database Error: Failed to Update Booking.", errors: {} };
  }

  await notifyTherapist(booking);
  returnToBookings();
}

export async function deleteBooking(id: string) {
  await requireBookingEditor();

  await sql`DELETE FROM bookings WHERE id = ${id}`;
  revalidatePath(BOOKINGS_PATH);
}

export async function setBookingStatus(
  id: string,
  status: ManualBookingStatus,
) {
  const user = await getCurrentUser();
  if (!isAdmin(user)) throw new Error("Unauthorized");

  await sql`
    UPDATE bookings
    SET status = ${status}
    WHERE id = ${id}
  `;
  revalidatePath(BOOKINGS_PATH);
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
