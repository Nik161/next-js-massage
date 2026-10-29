import { sql } from "@/app/lib/db";
import type { User } from "@/app/lib/definitions";

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const users = await sql<User[]>`
    SELECT *
    FROM users
    WHERE email = ${email}
  `;

  return users[0];
}

export async function getUserById(id: string): Promise<User | undefined> {
  const users = await sql<User[]>`
    SELECT
      id,
      name,
      email,
      role,
      COALESCE(balance, 0) AS balance
    FROM users
    WHERE id = ${id}
  `;

  return users[0];
}
