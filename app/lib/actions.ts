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

export async function sendBookingEmailToTherapist(booking: {
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
     <div style="margin:0; padding:40px 20px; background:#f5f5f4; font-family:Arial,Helvetica,sans-serif; color:#171717;"> <div style="max-width:600px; margin:0 auto;"> <!-- Header --> <div style="text-align:center; margin-bottom:24px;"> <div style="font-size:28px; font-weight:600; letter-spacing:0.5px;"> Niko Massage </div> <div style="margin-top:8px; font-size:14px; color:#737373;"> Новая запись на массаж </div> </div> <!-- Main card --> <div style="background:#ffffff; border-radius:20px; padding:32px; box-shadow:0 4px 20px rgba(0,0,0,0.06);"> <div style="text-align:center; margin-bottom:28px;"> <div style="font-size:13px; color:#737373; text-transform:uppercase; letter-spacing:1px;"> Новая запись </div> <div style="margin-top:10px; font-size:28px; font-weight:600;"> ${booking.date} </div> <div style="margin-top:6px; font-size:18px; color:#525252;"> ${booking.time} </div> </div> <!-- Details --> <div style="border-top:1px solid #e5e5e5; border-bottom:1px solid #e5e5e5; padding:20px 0;"> <div style="padding:10px 0;"> <div style="font-size:12px; color:#a3a3a3; text-transform:uppercase; letter-spacing:0.8px;"> Массаж </div> <div style="margin-top:4px; font-size:16px; font-weight:500;"> ${booking.type} </div> </div> <div style="padding:10px 0;"> <div style="font-size:12px; color:#a3a3a3; text-transform:uppercase; letter-spacing:0.8px;"> Продолжительность </div> <div style="margin-top:4px; font-size:16px; font-weight:500;"> ${booking.duration} мин. </div> </div> </div> <!-- Action --> <div style="text-align:center; margin-top:28px;"> <div style="margin-bottom:16px; font-size:14px; line-height:1.5; color:#737373;"> Проверьте данные записи и подтвердите её на сайте. </div> <a href="https://luxury-massage-pjg88gxpl-nikolaivoronkov-7533s-projects.vercel.app/" target="_blank" style=" display:inline-block; padding:14px 28px; border-radius:12px; background:#171717; color:#ffffff; font-size:15px; font-weight:600; text-decoration:none; " > Подтвердить запись </a> </div> </div> <!-- Footer --> <div style="padding:24px 10px; text-align:center; font-size:12px; line-height:1.5; color:#a3a3a3;"> Это автоматическое уведомление от Niko Massage.<br /> Пожалуйста, не отвечайте на это письмо. </div> </div> </div>
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
    therapist_id: formData.get("therapist_id"),
  });

  if (!validatedFields.success) {
    const flattened = z.flattenError(validatedFields.error);
    return {
      errors: flattened.fieldErrors,
      message: "Missing Fields. Failed to update Booking.",
    };
  }
  const { type, duration, date, time, therapist_id } = validatedFields.data;
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("No user id found");
  const dateTime = new Date(`${date}T${time}+00:00`);
  try {
    await sql`
    UPDATE bookings
    SET massage_type = ${type}, duration = ${duration}, date = ${dateTime}, therapist_id = ${therapist_id} 
    WHERE id = ${id}
  `;
  } catch (error) {
    console.error(error);
    return { message: "Database Error: Failed to Update Invoice.", errors: {} };
  }

  try {
    await sendBookingEmailToTherapist({
      date: date,
      time: time,
      duration: duration,
      type: type,
    });
  } catch (error) {
    console.error("Failed to send booking(update) email:", error);
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
    await sendBookingEmailToTherapist({
      date: date,
      time: time,
      duration: duration,
      type: type,
    });
  } catch (error) {
    console.error("Failed to send booking(create) email:", error);
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
