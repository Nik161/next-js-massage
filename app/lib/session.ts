import { cache } from "react";
import { auth } from "@/auth";
import { getUserById } from "@/app/lib/data/users";

// Cached per request, so several components can call it without extra queries.
export const getCurrentUser = cache(async () => {
  const session = await auth();
  const userId = session?.user?.id;
  return userId ? getUserById(userId) : undefined;
});

export async function requireUserId() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Unauthorized");
  return userId;
}
