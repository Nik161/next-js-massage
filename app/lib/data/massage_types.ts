import { sql } from "@/app/lib/db";
import type { MassageType } from "@/app/lib/definitions";

export async function getMassageTypes() {
  try {
    return await sql<MassageType[]>`
      SELECT
        id,
        name,
        description
      FROM massage_types
      ORDER BY name
    `;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to get massage types.");
  }
}
