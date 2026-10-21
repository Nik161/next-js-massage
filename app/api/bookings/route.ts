import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { parseJsonBody, parseWith, withApiErrors } from "@/app/lib/api/http";
import { requireUser } from "@/app/lib/api/auth";
import { bookingsOwnerFilter } from "@/app/lib/permissions";
import { BookingInputSchema, createBooking } from "@/app/lib/bookings";
import {
  fetchBookingById,
  fetchBookingsPages,
  fetchFilteredBookings,
} from "@/app/lib/data/bookings";

const ListQuerySchema = z.object({
  query: z.string().default(""),
  page: z.coerce.number().int().min(1).default(1),
});

// GET /api/bookings?query=...&page=1 → { bookings, totalPages }
// Regular users only get their own bookings, admins get all of them.
export const GET = withApiErrors(async (request: NextRequest) => {
  const user = await requireUser(request);
  const ownerId = bookingsOwnerFilter(user);

  const { query, page } = parseWith(
    ListQuerySchema,
    Object.fromEntries(request.nextUrl.searchParams),
    "Invalid query",
  );

  const [bookings, totalPages] = await Promise.all([
    fetchFilteredBookings(query, page, ownerId),
    fetchBookingsPages(query, ownerId),
  ]);
  return Response.json({ bookings, totalPages });
});

// POST /api/bookings { massage_type, duration, date, time, therapist_id } → 201 { booking }
export const POST = withApiErrors(async (request: NextRequest) => {
  const user = await requireUser(request);
  const input = await parseJsonBody(
    request,
    BookingInputSchema,
    "Missing Fields. Failed to create Booking.",
  );

  const id = await createBooking(user.id, input);
  revalidatePath("/bookings");

  const booking = await fetchBookingById(id, user.id);
  return Response.json({ booking }, { status: 201 });
});
