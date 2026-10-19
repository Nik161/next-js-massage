import { sql } from "@/app/lib/db";
import type { Therapist } from "@/app/lib/definitions";

export async function getTherapists() {
  try {
    return await sql<Therapist[]>`
      SELECT
        id,
        name,
        description,
        image_url
      FROM therapists
      ORDER BY name
    `;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to get therapists.");
  }
}
