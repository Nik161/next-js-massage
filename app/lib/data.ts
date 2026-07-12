import postgres from "postgres";
import { BookingResponse, State } from "@/app/lib/definitions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredBookings(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const bookings = await sql<BookingResponse[]>`
      SELECT
        bookings.id,
        TO_CHAR(date, 'YYYY-MM-DD HH24:MI') as date,
        bookings.massage_type,
        bookings.duration,
        bookings.user_id,
        bookings.status,
        bookings.is_social,
        users.name as user_name,
        users.email,
        users.image_url
        FROM bookings
        JOIN users ON bookings.user_id = users.id
      WHERE
        users.name ILIKE ${`%${query}%`} OR
        users.email ILIKE ${`%${query}%`} OR
        bookings.status ILIKE ${`%${query}%`} OR
        bookings.massage_type ILIKE ${`%${query}%`} OR
        bookings.date::text ILIKE ${`%${query}%`} OR
        bookings.duration::text ILIKE ${`%${query}%`}
      ORDER BY bookings.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return bookings;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices.");
  }
}

export async function fetchBookingsPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM bookings
    JOIN users ON bookings.user_id = users.id
    WHERE
      users.name ILIKE ${`%${query}%`} OR
      users.email ILIKE ${`%${query}%`} OR
      bookings.duration::text ILIKE ${`%${query}%`} OR
      bookings.date::text ILIKE ${`%${query}%`} OR
      bookings.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchBookingById(id: string) {
  try {
    const booking = await sql<BookingResponse[]>`
      SELECT
        bookings.id,
        TO_CHAR(date, 'YYYY-MM-DD HH24:MI') as date,
        bookings.massage_type,
        bookings.duration,
        bookings.user_id,
        bookings.status,
        bookings.is_social,
        users.name as user_name,
        users.email,
        users.image_url
        FROM bookings
        JOIN users ON bookings.user_id = users.id
      WHERE bookings.id = ${id};
    `;

    return booking[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
  }
}
