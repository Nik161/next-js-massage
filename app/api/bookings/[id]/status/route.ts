import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { parseJsonBody, withApiErrors } from "@/app/lib/api/http";
import { requireAdmin } from "@/app/lib/api/auth";
import { getBookingId } from "@/app/lib/api/params";
import { BookingStatusInputSchema, setBookingStatus } from "@/app/lib/bookings";

// PATCH /api/bookings/:id/status { status: "confirmed" | "completed" } → 204
export const PATCH = withApiErrors(
  async (
    request: NextRequest,
    { params }: RouteContext<"/api/bookings/[id]/status">,
  ) => {
    await requireAdmin(request);
    const id = await getBookingId(params);
    const { status } = await parseJsonBody(request, BookingStatusInputSchema);

    await setBookingStatus(id, status);
    revalidatePath("/bookings");

    return new Response(null, { status: 204 });
  },
);
