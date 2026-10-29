import bcrypt from "bcryptjs";
import { z } from "zod";
import { getUserByEmail } from "@/app/lib/data/users";

export const CredentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

// Compared against when the email is unknown, so the response time doesn't
// reveal which emails have an account.
const DUMMY_HASH = bcrypt.hashSync("dummy-password", 10);

// Shared by the NextAuth provider (web) and POST /api/auth/token (mobile).
export async function verifyCredentials(credentials: unknown) {
  const parsed = CredentialsSchema.safeParse(credentials);
  if (!parsed.success) return null;

  const { email, password } = parsed.data;
  const user = await getUserByEmail(email);

  const passwordsMatch = await bcrypt.compare(
    password,
    user?.password ?? DUMMY_HASH,
  );
  if (!user || !passwordsMatch) return null;

  // Never let the password hash leave this function
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}
