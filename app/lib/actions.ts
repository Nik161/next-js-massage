"use server";

import { State } from "@/app/lib/definitions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import postgres from "postgres";
import { z } from "zod";
import { auth, signIn } from "@/auth";
import { AuthError } from "next-auth";
import { getUserById } from "@/app/lib/data/users";
import { Resend } from "resend";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingCreatedEmail(booking: {
  type: string;
  duration: number;
  date: string;
  time: string;
}) {
  return resend.emails.send({
    from: "onboarding@resend.dev",
    to: process.env.ADMIN_EMAIL!,
    subject: "Новая запись на массаж",
    html: `
      <h1>Новая запись</h1>

      <p><strong>Дата:</strong> ${booking.date}</p>
      <p><strong>Массаж:</strong> ${booking.type}</p>
      <p><strong>Продолжительность:</strong> ${booking.duration} мин.</p>
      <p><strong>Время:</strong> ${booking.time}</p>
      <p><strong>
      <a href="https://luxury-massage-pjg88gxpl-nikolaivoronkov-7533s-projects.vercel.app/" target="_blank">Подтрведить на сайте</a>
      </strong></p>
    `,
  });
}

const FormSchema = z.object({
  id: z.string(),
  type: z.string({
    message: "Please select a massage type.",
  }),
  duration: z.coerce
    .number({
      message: "Please enter a valid number.", // Используйте message вместо invalid_type_error
    })
    .positive({ message: "Duration must be positive." })
    .int({ message: "Duration must be a whole number." }),
  // status: z.enum(["booked", "confirmed", "canceled", "completed"], {
  //   message: "Please select a booking status.",
  // }),
  date: z.string(),
  time: z.string(),
  therapist_id: z.string(),
});

const UpdateBooking = FormSchema.omit({ id: true });
const CreateBooking = FormSchema.omit({ id: true });

export async function updateBooking(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateBooking.safeParse({
    type: formData.get("massage_type"),
    duration: formData.get("booking_duration"),
    date: formData.get("booking_date"),
    time: formData.get("booking_time"),
  });

  if (!validatedFields.success) {
    const flattened = z.flattenError(validatedFields.error);
    return {
      errors: flattened.fieldErrors,
      message: "Missing Fields. Failed to update Booking.",
    };
  }
  const { type, duration, date, time } = validatedFields.data;
  const dateTime = new Date(`${date}T${time}+00:00`);
  try {
    await sql`
    UPDATE bookings
    SET massage_type = ${type}, duration = ${duration}, date = ${dateTime}
    WHERE id = ${id}
  `;
  } catch (error) {
    console.error(error);
    return { message: "Database Error: Failed to Update Invoice.", errors: {} };
  }

  revalidatePath("/bookings");
  redirect("/bookings");
}

export async function deleteBooking(id: string) {
  await sql`DELETE FROM bookings WHERE id = ${id}`;
  revalidatePath("/bookings");
}

export async function createBooking(prevState: State, formData: FormData) {
  const validatedFields = CreateBooking.safeParse({
    type: formData.get("massage_type"),
    duration: formData.get("booking_duration"),
    date: formData.get("booking_date"),
    time: formData.get("booking_time"),
    therapist_id: formData.get("therapist_id"),
  });
  console.log("formdata", formData);
  console.log("validated fiels", validatedFields);

  if (!validatedFields.success) {
    const flattened = z.flattenError(validatedFields.error);
    return {
      errors: flattened.fieldErrors,
      message: "Missing Fields. Failed to create Booking.",
    };
  }
  const { type, duration, date, time, therapist_id } = validatedFields.data;

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("No user id found");

  const dateTime = new Date(`${date}T${time}+00:00`);
  const statusDefault = "booked";
  const isSocialDefault = true;
  const uuid = crypto.randomUUID();
  try {
    await sql`
      INSERT INTO bookings (id,massage_type, duration, status, date, is_social, user_id, therapist_id )
      VALUES (${uuid}, ${type}, ${duration}, ${statusDefault}, ${dateTime}, ${isSocialDefault}, ${userId}, ${therapist_id} )
    `;
  } catch (error) {
    console.error(error);
    return { message: "Database Error: Failed to Create Invoice.", errors: {} };
  }

  try {
    await sendBookingCreatedEmail({
      date: date,
      time: time,
      duration: duration,
      type: type,
    });
  } catch (error) {
    console.error("Failed to send booking email:", error);
  }
  revalidatePath("/bookings");
  redirect("/bookings");
}

export async function setBookingStatus(
  id: string,
  status: "confirmed" | "completed",
) {
  const session = await auth();
  const userId = session?.user?.id;
  const user = userId ? await getUserById(userId) : null;
  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  await sql`
    UPDATE bookings
    SET status = ${status}
    WHERE id = ${id}
`;
  revalidatePath("/bookings");
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
