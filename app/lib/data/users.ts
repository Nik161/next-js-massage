import postgres from "postgres";
import type { User } from "@/app/lib/definitions";

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: "require",
});

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
    SELECT *
    FROM users
    WHERE id = ${id}
  `;

  return users[0];
}
