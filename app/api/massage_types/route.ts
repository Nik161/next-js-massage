import { withApiErrors } from "@/app/lib/api/http";
import { getMassageTypes } from "@/app/lib/data/massage_types";

// GET /api/massage_types → { massageTypes }; public, the landing page shows them too.
export const GET = withApiErrors(async () => {
  const massageTypes = await getMassageTypes();
  return Response.json({ massageTypes });
});
