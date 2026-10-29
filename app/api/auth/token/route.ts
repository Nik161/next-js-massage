import { ApiError, readJsonBody, withApiErrors } from "@/app/lib/api/http";
import { createApiToken } from "@/app/lib/api/auth";
import { verifyCredentials } from "@/app/lib/credentials";

// POST /api/auth/token { email, password } → { token, expiresIn, user }
// For the mobile app; send the token as `Authorization: Bearer <token>`.
export const POST = withApiErrors(async (request: Request) => {
  const user = await verifyCredentials(await readJsonBody(request));
  if (!user) throw new ApiError(401, "Invalid credentials.");

  const { token, expiresIn } = await createApiToken(user.id);
  return Response.json({ token, expiresIn, user });
});
