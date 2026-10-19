import type { User } from "@/app/lib/definitions";

type UserWithRole = Pick<User, "role"> | null | undefined;

export function isAdmin(user: UserWithRole) {
  return user?.role === "admin";
}

// For now only admins may edit or delete bookings.
export function canEditBooking(user: UserWithRole) {
  return isAdmin(user);
}
