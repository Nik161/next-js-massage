import { ApiError, withApiErrors } from "@/app/lib/api/http";
import { createApiToken } from "@/app/lib/api/auth";
import { verifyCredentials } from "@/app/lib/credentials";

// POST /api/auth/token { email, password } → { token, expiresIn, user }
// For the mobile app; send the token as `Authorization: Bearer <token>`.
export const POST = withApiErrors(async (request: Request) => {
  let credentials: unknown;
  try {
    credentials = await request.json();
  } catch {
    throw new ApiError(400, "Request body must be valid JSON");
  }

  const user = await verifyCredentials(credentials);
  if (!user) throw new ApiError(401, "Invalid credentials.");

  const { token, expiresIn } = await createApiToken(user.id);
  return Response.json({ token, expiresIn, user });
});
