import { sql } from "@/app/lib/db";
import { salonNow } from "@/app/lib/booking_time";
import type { BookingResponse } from "@/app/lib/definitions";

const ITEMS_PER_PAGE = 6;

// A confirmed booking counts as completed once its session is over, so nobody
// has to complete it by hand. The stored status stays "confirmed".
function bookingStatus() {
  return sql`
    CASE
      WHEN bookings.status = 'confirmed' AND bookings.ends_at <= ${salonNow()}
        THEN 'completed'
      ELSE bookings.status
    END
  `;
}

function bookingColumns() {
  return sql`
    bookings.id,
    TO_CHAR(bookings.date, 'YYYY-MM-DD HH24:MI') AS date,
    bookings.massage_type,
    bookings.duration,
    bookings.user_id,
    ${bookingStatus()} AS status,
    bookings.is_social,
    bookings.therapist_id,
    users.name AS user_name,
    users.email,
    users.image_url,
    therapists.name AS therapist_name
  `;
}

// `null` means bookings of every user (admins), see bookingsOwnerFilter.
export type BookingsOwner = string | null;

function ownedBy(ownerId: BookingsOwner) {
  return sql`(${ownerId}::uuid IS NULL OR bookings.user_id = ${ownerId}::uuid)`;
}

// Shared by the list and the page count, so pagination always matches the results.
function matchesQuery(query: string, ownerId: BookingsOwner) {
  const pattern = `%${query}%`;
  return sql`
    ${ownedBy(ownerId)} AND (
      users.name ILIKE ${pattern} OR
      users.email ILIKE ${pattern} OR
      ${bookingStatus()} ILIKE ${pattern} OR
      bookings.massage_type ILIKE ${pattern} OR
      bookings.date::text ILIKE ${pattern} OR
      bookings.duration::text ILIKE ${pattern}
    )
  `;
}

export async function fetchFilteredBookings(
  query: string,
  currentPage: number,
  ownerId: BookingsOwner,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    return await sql<BookingResponse[]>`
      SELECT ${bookingColumns()}
      FROM bookings
        JOIN users ON bookings.user_id = users.id
        LEFT JOIN therapists ON bookings.therapist_id = therapists.id
      WHERE ${matchesQuery(query, ownerId)}
      ORDER BY bookings.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch bookings.");
  }
}

export async function fetchBookingsPages(
  query: string,
  ownerId: BookingsOwner,
) {
  try {
    const data = await sql<{ count: string }[]>`
      SELECT COUNT(*)
      FROM bookings
        JOIN users ON bookings.user_id = users.id
      WHERE ${matchesQuery(query, ownerId)}
    `;

    return Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of bookings.");
  }
}

export async function fetchBookingById(
  id: string,
  ownerId: BookingsOwner,
): Promise<BookingResponse | undefined> {
  try {
    const bookings = await sql<BookingResponse[]>`
      SELECT ${bookingColumns()}
      FROM bookings
        JOIN users ON bookings.user_id = users.id
        LEFT JOIN therapists ON bookings.therapist_id = therapists.id
      WHERE bookings.id = ${id} AND ${ownedBy(ownerId)}
    `;

    return bookings[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch booking.");
  }
}
