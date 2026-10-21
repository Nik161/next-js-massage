import type { NextRequest } from "next/server";
import { z } from "zod";
import { parseWith, withApiErrors } from "@/app/lib/api/http";
import { requireUser } from "@/app/lib/api/auth";
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
export const GET = withApiErrors(async (request: NextRequest) => {
  // The proxy does not cover /api, so check the session here.
  await requireUser(request);

  const query = parseWith(
    SlotQuerySchema,
    Object.fromEntries(request.nextUrl.searchParams),
    "Invalid query",
  );

  const slots = await getAvailableSlots(query);
  return Response.json({ slots });
});
