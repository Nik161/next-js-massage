import type { User } from "@/app/lib/definitions";

type UserWithRole = Pick<User, "role"> | null | undefined;

export function isAdmin(user: UserWithRole) {
  return user?.role === "admin";
}

// For now only admins may edit or delete bookings.
export function canEditBooking(user: UserWithRole) {
  return isAdmin(user);
}

// Admins see every booking, everyone else only their own.
// Returns the owner to filter by, or null for no filter.
export function bookingsOwnerFilter(user: Pick<User, "id" | "role">) {
  return isAdmin(user) ? null : user.id;
}
