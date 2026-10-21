import { withApiErrors } from "@/app/lib/api/http";
import { requireUser } from "@/app/lib/api/auth";

// GET /api/me → { user }
export const GET = withApiErrors(async (request: Request) => {
  const user = await requireUser(request);
  return Response.json({ user });
});
