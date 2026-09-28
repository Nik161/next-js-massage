import BookingStatus from "@/app/ui/booking/booking_status";
import { DeleteBooking, UpdateBooking } from "@/app/ui/shared/buttons";
import { fetchFilteredBookings } from "@/app/lib/data/bookings";
import ConfirmBookingButton from "@/app/ui/shared/confirmBookingButton";
import CompleteBookingButton from "@/app/ui/shared/completeBookingButton";
import { auth } from "@/auth";
import { getUserById } from "@/app/lib/data/users";
import { BookingResponse } from "@/app/lib/definitions";
import BookingMassageType from "@/app/ui/booking/booking_massage_type";

export default async function BookingTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const session = await auth();
  const userId = session?.user?.id;
  const user = userId ? await getUserById(userId) : null;
  const bookings = await fetchFilteredBookings(query, currentPage);

  function canEditBooking(booking: BookingResponse): boolean {
    if (user?.role === "admin") {
      return true;
    }
    if (booking.status === "completed") return false;
    return false;
  }

  return (
    <div className="mt-8 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm">
          {/* MOBILE VIEW */}
          <div className="md:hidden">
            {bookings?.map((booking) => (
              <div
                key={booking.id}
                className="border-b border-gray-200 bg-white p-5 last:border-b-0"
              >
                {/* Client + status */}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-lg font-medium text-gray-900">
                      {booking.user_name}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {booking.therapist_name}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <BookingStatus status={booking.status} />
                  </div>
                </div>

                {/* Booking information */}
                <div className="mt-5 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Массаж
                    </p>

                    <div className="mt-1">
                      <BookingMassageType
                        massage_type={booking.massage_type}
                        key={booking.massage_type}
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Продолжительность
                    </p>

                    <p className="mt-1 text-base font-medium text-gray-900">
                      {booking.duration} минут
                    </p>
                  </div>

                  <div className="col-span-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Дата и время
                    </p>

                    <p className="mt-1 text-base font-medium text-gray-900">
                      {booking.date.toString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 flex justify-end gap-2 border-t border-gray-100 pt-4">
                  {booking.status === "booked" && user?.role === "admin" && (
                    <ConfirmBookingButton bookingId={booking.id} />
                  )}

                  {booking.status === "confirmed" && user?.role === "admin" && (
                    <CompleteBookingButton bookingId={booking.id} />
                  )}

                  <UpdateBooking
                    id={booking.id}
                    disabled={!canEditBooking(booking)}
                  />

                  <DeleteBooking
                    id={booking.id}
                    disabled={!canEditBooking(booking)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left">
                <th
                  scope="col"
                  className="px-6 py-5 text-sm font-medium uppercase tracking-wide text-gray-500"
                >
                  Клиент
                </th>

                <th
                  scope="col"
                  className="px-6 py-5 text-sm font-medium uppercase tracking-wide text-gray-500"
                >
                  Массажист
                </th>

                <th
                  scope="col"
                  className="px-4 py-5 text-sm font-medium uppercase tracking-wide text-gray-500"
                >
                  Тип
                </th>

                <th
                  scope="col"
                  className="px-4 py-5 text-sm font-medium uppercase tracking-wide text-gray-500"
                >
                  Дата / Время
                </th>

                <th
                  scope="col"
                  className="px-4 py-5 text-sm font-medium uppercase tracking-wide text-gray-500"
                >
                  Статус
                </th>

                <th scope="col" className="relative py-5 pl-4 pr-6">
                  <span className="sr-only">Действия</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {bookings?.map((booking) => (
                <tr
                  key={booking.id}
                  className="group transition-colors hover:bg-gray-50/70"
                >
                  {/* Client */}
                  <td className="whitespace-nowrap px-6 py-5">
                    <p className="text-base font-medium text-gray-900">
                      {booking.user_name}
                    </p>
                  </td>

                  {/* Therapist */}
                  <td className="whitespace-nowrap px-6 py-5">
                    <p className="text-base text-gray-700">
                      {booking.therapist_name}
                    </p>
                  </td>

                  {/* Massage */}
                  <td className="whitespace-nowrap px-4 py-5">
                    <div className="flex flex-col gap-1">
                      <BookingMassageType
                        massage_type={booking.massage_type}
                        key={booking.massage_type}
                      />
                      <span className="text-sm text-gray-500">
                        {booking.duration} минут
                      </span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="whitespace-nowrap px-4 py-5">
                    <span className="text-base font-medium text-gray-900">
                      {booking.date}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="whitespace-nowrap px-4 py-5">
                    <BookingStatus status={booking.status} />
                  </td>

                  {/* Actions */}
                  <td className="whitespace-nowrap py-5 pl-4 pr-6">
                    <div className="flex justify-end gap-2 opacity-80 transition-opacity group-hover:opacity-100">
                      {booking.status === "booked" &&
                        user?.role === "admin" && (
                          <ConfirmBookingButton bookingId={booking.id} />
                        )}

                      {booking.status === "confirmed" &&
                        user?.role === "admin" && (
                          <CompleteBookingButton bookingId={booking.id} />
                        )}

                      <UpdateBooking
                        id={booking.id}
                        disabled={!canEditBooking(booking)}
                      />

                      <DeleteBooking
                        id={booking.id}
                        disabled={!canEditBooking(booking)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
