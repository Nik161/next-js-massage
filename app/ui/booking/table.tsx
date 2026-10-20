import Image from "next/image";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { fetchFilteredBookings } from "@/app/lib/data/bookings";
import { getMassageTypes } from "@/app/lib/data/massage_types";
import { getCurrentUser } from "@/app/lib/session";
import { formatDayParts } from "@/app/lib/booking_time";
import type { BookingResponse } from "@/app/lib/definitions";
import BookingStatus from "@/app/ui/booking/booking_status";
import BookingActions from "@/app/ui/booking/booking_actions";

const COLUMNS = ["Клиент", "Массажист", "Программа", "Дата", "Статус"];

// Rows appear one after another
const STAGGER_MS = 50;

function Avatar({ name, imageUrl }: { name: string; imageUrl: string | null }) {
  if (imageUrl) {
    return (
      <span className="relative size-20 shrink-0 overflow-hidden rounded-full bg-forest ring-2 ring-gold/20">
        <Image
          src={imageUrl}
          alt={name}
          fill
          // Local photos go through the optimizer; remote hosts would need an allowlist
          unoptimized={!imageUrl.startsWith("/")}
          sizes="80px"
          className="object-cover"
        />
      </span>
    );
  }

  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <span className="flex size-20 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-forest-soft to-forest font-display text-3xl text-gold ring-2 ring-gold/20">
      {initials}
    </span>
  );
}

function BookingDate({ date }: { date: BookingResponse["date"] }) {
  const [day, time] = date.split(" ");
  const { weekday, day: dayNumber, month } = formatDayParts(day);

  return (
    <div className="flex items-center gap-3">
      <div className="flex w-12 flex-col items-center rounded-xl border border-line bg-sand py-1 leading-none">
        <span className="text-[0.65rem] uppercase tracking-wider text-muted">
          {month}
        </span>
        <span className="font-display text-xl font-medium text-ink">
          {dayNumber}
        </span>
      </div>
      <div className="leading-tight">
        <p className="font-medium text-ink">{time}</p>
        <p className="text-sm capitalize text-muted">{weekday}</p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-6 flex animate-fade-up flex-col items-center rounded-3xl border border-dashed border-line bg-white/60 px-6 py-16 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-gold-soft text-gold-dark">
        <CalendarDaysIcon className="size-8" />
      </span>
      <h3 className="mt-5 font-display text-2xl text-ink">Сеансы не найдены</h3>
      <p className="mt-2 max-w-sm text-muted">
        Попробуйте изменить запрос или запишитесь на новый сеанс.
      </p>
    </div>
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

  console.log("booking", bookings);

  const massageTypeNames = new Map(
    massageTypes.map((type) => [type.id, type.name]),
  );

  if (bookings.length === 0) return <EmptyState />;

  return (
    <div className="mt-6">
      {/* MOBILE VIEW */}
      <div className="space-y-3 md:hidden">
        {bookings.map((booking, index) => (
          <article
            key={booking.id}
            style={{ animationDelay: `${index * STAGGER_MS}ms` }}
            className="animate-fade-up rounded-3xl border border-line bg-white p-5 shadow-soft"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar name={booking.user_name} imageUrl={booking.image_url} />
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink">
                    {booking.user_name}
                  </p>
                  <p className="truncate text-sm text-muted">
                    к {booking.therapist_name}
                  </p>
                </div>
              </div>
              <BookingStatus status={booking.status} />
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-sand p-3">
              <BookingDate date={booking.date} />
              <div className="text-right leading-tight">
                <p className="font-medium text-ink">
                  {massageTypeNames.get(booking.massage_type)}
                </p>
                <p className="text-sm text-muted">{booking.duration} мин</p>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <BookingActions booking={booking} user={user} />
            </div>
          </article>
        ))}
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden overflow-hidden rounded-3xl border border-line bg-white shadow-soft md:block">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-line bg-sand/70">
              {COLUMNS.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="px-5 py-4 text-xs font-medium uppercase tracking-[0.15em] text-muted first:pl-7"
                >
                  {column}
                </th>
              ))}
              <th scope="col" className="py-4 pl-4 pr-7">
                <span className="sr-only">Действия</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-line">
            {bookings.map((booking, index) => (
              <tr
                key={booking.id}
                style={{ animationDelay: `${index * STAGGER_MS}ms` }}
                className="group animate-fade-up transition-colors duration-200 hover:bg-sand/60"
              >
                <td className="whitespace-nowrap py-4 pl-7 pr-5">
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={booking.user_name}
                      imageUrl={booking.image_url}
                    />
                    <div className="leading-tight">
                      <p className="font-medium text-ink">
                        {booking.user_name}
                      </p>
                      <p className="text-sm text-muted">{booking.email}</p>
                    </div>
                  </div>
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-ink">
                  {booking.therapist_name}
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  <p className="text-ink">
                    {massageTypeNames.get(booking.massage_type)}
                  </p>
                  <p className="text-sm text-muted">{booking.duration} мин</p>
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  <BookingDate date={booking.date} />
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  <BookingStatus status={booking.status} />
                </td>

                <td className="whitespace-nowrap py-4 pl-4 pr-7">
                  <div className="flex justify-end gap-2 opacity-70 transition-opacity duration-200 group-hover:opacity-100">
                    <BookingActions booking={booking} user={user} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
