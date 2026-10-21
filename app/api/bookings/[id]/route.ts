import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { ApiError, parseJsonBody, withApiErrors } from "@/app/lib/api/http";
import { requireAdmin, requireUser } from "@/app/lib/api/auth";
import { getBookingId } from "@/app/lib/api/params";
import { bookingsOwnerFilter } from "@/app/lib/permissions";
import {
  BookingInputSchema,
  deleteBooking,
  updateBooking,
} from "@/app/lib/bookings";
import { fetchBookingById } from "@/app/lib/data/bookings";

type Context = RouteContext<"/api/bookings/[id]">;

// GET /api/bookings/:id → { booking }; someone else's booking is a 404 for regular users.
export const GET = withApiErrors(
  async (request: NextRequest, { params }: Context) => {
    const user = await requireUser(request);
    const id = await getBookingId(params);

    const booking = await fetchBookingById(id, bookingsOwnerFilter(user));
    if (!booking) throw new ApiError(404, "Booking not found");
    return Response.json({ booking });
  },
);

// PUT /api/bookings/:id { massage_type, duration, date, time, therapist_id } → { booking }
export const PUT = withApiErrors(
  async (request: NextRequest, { params }: Context) => {
    await requireAdmin(request);
    const id = await getBookingId(params);
    const input = await parseJsonBody(
      request,
      BookingInputSchema,
      "Missing Fields. Failed to update Booking.",
    );

    await updateBooking(id, input);
    revalidatePath("/bookings");

    const booking = await fetchBookingById(id, null);
    return Response.json({ booking });
  },
);

// DELETE /api/bookings/:id → 204
export const DELETE = withApiErrors(
  async (request: NextRequest, { params }: Context) => {
    await requireAdmin(request);
    const id = await getBookingId(params);

    await deleteBooking(id);
    revalidatePath("/bookings");

    return new Response(null, { status: 204 });
  },
);
