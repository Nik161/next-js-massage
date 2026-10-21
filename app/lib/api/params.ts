import { z } from "zod";
import { ApiError } from "@/app/lib/api/http";

// A malformed id can't match any row, and Postgres would reject it as a uuid anyway.
export async function getBookingId(params: Promise<{ id: string }>) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) {
    throw new ApiError(404, "Booking not found");
  }
  return id;
}
