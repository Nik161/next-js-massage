import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserById } from "@/app/lib/data/users";

// Cached per request, so several components can call it without extra queries.
export const getCurrentUser = cache(async () => {
  const session = await auth();
  const userId = session?.user?.id;
  return userId ? getUserById(userId) : undefined;
});

// For pages: the proxy already redirects signed-out visitors, but a proxy
// bypass or a deleted account must not reach the page either.
export async function requireCurrentUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
