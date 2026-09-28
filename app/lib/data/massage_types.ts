import postgres from "postgres";
import { MassageType } from "@/app/lib/definitions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function getMassageTypes() {
  try {
    const massageTypes = await sql<MassageType[]>`
      SELECT
        id,
        name,
        description
      FROM massage_types
      ORDER BY name
    `;
    return massageTypes;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to get massage types");
  }
}
