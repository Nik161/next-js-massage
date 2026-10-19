import postgres from "postgres";

// Single shared connection pool for the whole app.
export const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });
