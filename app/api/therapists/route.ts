import { withApiErrors } from "@/app/lib/api/http";
import { getTherapists } from "@/app/lib/data/therapists";

// GET /api/therapists → { therapists }; public, the landing page shows them too.
export const GET = withApiErrors(async () => {
  const therapists = await getTherapists();
  return Response.json({ therapists });
});
