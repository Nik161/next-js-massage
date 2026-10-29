import { createHash, timingSafeEqual } from "node:crypto";
import { ApiError, withApiErrors } from "@/app/lib/api/http";
import { resetWeeklyBalances } from "@/app/lib/balance";

// Hashing first gives equal lengths, which timingSafeEqual requires.
function digest(value: string) {
  return createHash("sha256").update(value).digest();
}

function isCronRequest(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization") ?? "";
  return timingSafeEqual(digest(header), digest(`Bearer ${secret}`));
}

// GET /api/cron/weekly-balance → { updated }
// Called by Vercel Cron on Mondays at 00:00 salon time, 03:00 UTC (see vercel.json).
// Vercel sends CRON_SECRET as a Bearer token.
export const GET = withApiErrors(async (request: Request) => {
  if (!isCronRequest(request)) throw new ApiError(401, "Unauthorized");

  const updated = await resetWeeklyBalances();
  return Response.json({ updated });
});
