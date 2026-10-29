import { ApiError, withApiErrors } from "@/app/lib/api/http";
import { resetWeeklyBalances } from "@/app/lib/balance";

// GET /api/cron/weekly-balance → { updated }
// Called by Vercel Cron on Mondays at 00:00 salon time, 03:00 UTC (see vercel.json).
// Vercel sends CRON_SECRET as a Bearer token.
export const GET = withApiErrors(async (request: Request) => {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    throw new ApiError(401, "Unauthorized");
  }

  const updated = await resetWeeklyBalances();
  return Response.json({ updated });
});
