import type { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { MASSAGE_DURATIONS } from "@/app/constants/massage_durations";
import { getAvailableSlots } from "@/app/lib/data/availability";

const SlotQuerySchema = z.object({
  therapistId: z.uuid(),
  date: z.iso.date(),
  duration: z.coerce
    .number()
    .refine((value) => MASSAGE_DURATIONS.includes(value)),
  excludeBookingId: z.uuid().optional(),
});

// GET /api/massage_slots?therapistId=...&date=YYYY-MM-DD&duration=60[&excludeBookingId=...]
export async function GET(request: NextRequest) {
  // The proxy does not cover /api, so check the session here.
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const query = SlotQuerySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams),
  );
  if (!query.success) {
    return Response.json(
      { error: "Invalid query", details: z.flattenError(query.error) },
      { status: 400 },
    );
  }

  try {
    const slots = await getAvailableSlots(query.data);
    return Response.json({ slots });
  } catch (error) {
    console.error("Failed to get available slots:", error);
    return Response.json({ error: "Failed to get slots" }, { status: 500 });
  }
}
