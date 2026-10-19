import type { BookingResponse, User } from "@/app/lib/definitions";
import { canEditBooking, isAdmin } from "@/app/lib/permissions";
import { DeleteBooking, UpdateBooking } from "@/app/ui/booking/buttons";
import SetBookingStatusButton from "@/app/ui/booking/status_button";

export default function BookingActions({
  booking,
  user,
}: {
  booking: BookingResponse;
  user: User | undefined;
}) {
  const canEdit = canEditBooking(user);

  return (
    <>
      {isAdmin(user) && booking.status === "booked" && (
        <SetBookingStatusButton bookingId={booking.id} status="confirmed" />
      )}

      {isAdmin(user) && booking.status === "confirmed" && (
        <SetBookingStatusButton bookingId={booking.id} status="completed" />
      )}

      <UpdateBooking id={booking.id} disabled={!canEdit} />
      <DeleteBooking id={booking.id} disabled={!canEdit} />
    </>
  );
}
