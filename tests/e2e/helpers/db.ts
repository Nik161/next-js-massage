import { readFileSync } from "node:fs";
import postgres from "postgres";

// Reads POSTGRES_URL from the environment or .env (Playwright does not load .env)
function databaseUrl() {
  if (process.env.POSTGRES_URL) return process.env.POSTGRES_URL;
  const env = readFileSync(".env", "utf8");
  const match = env.match(/^POSTGRES_URL=(.*)$/m);
  if (!match) throw new Error("POSTGRES_URL is not configured");
  return match[1].replace(/^["']|["']$/g, "");
}

// Removes bookings created by the e2e user at the given start time
export async function deleteTestBooking(email: string, startsAt: Date) {
  const sql = postgres(databaseUrl(), { ssl: "require", max: 1 });
  try {
    await sql`
      DELETE FROM bookings
      USING users
      WHERE bookings.user_id = users.id
        AND users.email = ${email}
        AND bookings.date = ${startsAt}
    `;
  } finally {
    await sql.end();
  }
}
