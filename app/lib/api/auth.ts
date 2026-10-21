import { encode, decode } from "next-auth/jwt";
import { auth } from "@/auth";
import { getUserById } from "@/app/lib/data/users";
import { isAdmin } from "@/app/lib/permissions";
import { ApiError } from "@/app/lib/api/http";

// Distinct from the session cookie salt, so a cookie value can't be replayed as a token.
const TOKEN_SALT = "social-massage.api-token";
const TOKEN_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set");
  return secret;
}

// Bearer token for clients without cookies (the mobile app).
export async function createApiToken(userId: string) {
  return {
    token: await encode({
      token: { sub: userId },
      secret: getSecret(),
      salt: TOKEN_SALT,
      maxAge: TOKEN_MAX_AGE,
    }),
    expiresIn: TOKEN_MAX_AGE,
  };
}

async function getUserIdFromBearer(header: string) {
  const token = header.slice("Bearer ".length).trim();
  try {
    const payload = await decode({
      token,
      secret: getSecret(),
      salt: TOKEN_SALT,
    });
    return payload?.sub ?? undefined;
  } catch {
    return undefined;
  }
}

// The web app sends the NextAuth session cookie, the mobile app a Bearer token.
async function getRequestUserId(request: Request) {
  const header = request.headers.get("authorization");
  if (header?.startsWith("Bearer ")) return getUserIdFromBearer(header);

  const session = await auth();
  return session?.user?.id;
}

export async function getRequestUser(request: Request) {
  const userId = await getRequestUserId(request);
  return userId ? getUserById(userId) : undefined;
}

export async function requireUser(request: Request) {
  const user = await getRequestUser(request);
  if (!user) throw new ApiError(401, "Unauthorized");
  return user;
}

export async function requireAdmin(request: Request) {
  const user = await requireUser(request);
  if (!isAdmin(user)) throw new ApiError(403, "Forbidden");
  return user;
}
