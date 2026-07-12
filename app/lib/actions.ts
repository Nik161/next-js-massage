"use server";

import { State } from "@/app/lib/definitions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import postgres from "postgres";
import { z } from "zod";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

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
  //   message: "Please select an booking status.",
  // }),
  date: z.string(),
});

const UpdateBooking = FormSchema.omit({ id: true });

export async function updateBooking(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateBooking.safeParse({
    type: formData.get("massage_type"),
    duration: formData.get("booking_duration"),
    date: formData.get("booking_date"),
  });

  console.log("validatedFields", validatedFields);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Invoice.",
    };
  }
  const { type, duration, date } = validatedFields.data;

  try {
    await sql`
    UPDATE bookings
    SET massage_type = ${type}, duration = ${duration}, date = ${date}
    WHERE id = ${id}
  `;
  } catch (error) {
    console.error(error);
    return { message: "Database Error: Failed to Update Invoice.", errors: {} };
  }

  revalidatePath("/bookings");
  redirect("/bookings");
}
