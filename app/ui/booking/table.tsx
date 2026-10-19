import clsx from "clsx";
import { fetchFilteredBookings } from "@/app/lib/data/bookings";
import { getMassageTypes } from "@/app/lib/data/massage_types";
import { getCurrentUser } from "@/app/lib/session";
import BookingStatus from "@/app/ui/booking/booking_status";
import BookingActions from "@/app/ui/booking/booking_actions";

const COLUMNS = [
  { label: "Клиент", className: "px-6" },
  { label: "Массажист", className: "px-6" },
  { label: "Тип", className: "px-4" },
  { label: "Дата / Время", className: "px-4" },
  { label: "Статус", className: "px-4" },
];

function DetailLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
      {children}
    </p>
  );
}

export default async function BookingTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const [user, bookings, massageTypes] = await Promise.all([
    getCurrentUser(),
    fetchFilteredBookings(query, currentPage),
    getMassageTypes(),
  ]);

  const massageTypeNames = new Map(
    massageTypes.map((type) => [type.id, type.name]),
  );

  if (bookings.length === 0) {
    return (
      <p className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 text-center text-lg text-gray-500">
        Сеансы не найдены.
      </p>
    );
  }

  return (
    <div className="mt-8 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm">
          {/* MOBILE VIEW */}
          <div className="md:hidden">
            {bookings.map((booking) => (
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
                    <DetailLabel>Массаж</DetailLabel>
                    <p className="mt-1">
                      {massageTypeNames.get(booking.massage_type)}
                    </p>
                  </div>

                  <div>
                    <DetailLabel>Продолжительность</DetailLabel>
                    <p className="mt-1 text-base font-medium text-gray-900">
                      {booking.duration} минут
                    </p>
                  </div>

                  <div className="col-span-2">
                    <DetailLabel>Дата и время</DetailLabel>
                    <p className="mt-1 text-base font-medium text-gray-900">
                      {booking.date}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 flex justify-end gap-2 border-t border-gray-100 pt-4">
                  <BookingActions booking={booking} user={user} />
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left">
                {COLUMNS.map((column) => (
                  <th
                    key={column.label}
                    scope="col"
                    className={clsx(
                      "py-5 text-sm font-medium uppercase tracking-wide text-gray-500",
                      column.className,
                    )}
                  >
                    {column.label}
                  </th>
                ))}
                <th scope="col" className="relative py-5 pl-4 pr-6">
                  <span className="sr-only">Действия</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="group transition-colors hover:bg-gray-50/70"
                >
                  <td className="whitespace-nowrap px-6 py-5">
                    <p className="text-base font-medium text-gray-900">
                      {booking.user_name}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-6 py-5">
                    <p className="text-base text-gray-700">
                      {booking.therapist_name}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-4 py-5">
                    <div className="flex flex-col gap-1">
                      <span>{massageTypeNames.get(booking.massage_type)}</span>
                      <span className="text-sm text-gray-500">
                        {booking.duration} минут
                      </span>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-4 py-5">
                    <span className="text-base font-medium text-gray-900">
                      {booking.date}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-4 py-5">
                    <BookingStatus status={booking.status} />
                  </td>

                  <td className="whitespace-nowrap py-5 pl-4 pr-6">
                    <div className="flex justify-end gap-2 opacity-80 transition-opacity group-hover:opacity-100">
                      <BookingActions booking={booking} user={user} />
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
