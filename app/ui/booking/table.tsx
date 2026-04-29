import BookingStatus from "@/app/ui/booking/booking_status";
import { DeleteBooking, UpdateBooking } from "@/app/ui/shared/buttons";
import { fetchFilteredBookings } from "@/app/lib/data";

export default async function BookingTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const bookings = await fetchFilteredBookings(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/*<div className="md:hidden">*/}
          {/*  {bookings?.map((bookings) => (*/}
          {/*    <div*/}
          {/*      key={bookings.id}*/}
          {/*      className="mb-2 w-full rounded-md bg-white p-4"*/}
          {/*    >*/}
          {/*      <div className="flex items-center justify-between border-b pb-4">*/}
          {/*        <div>*/}
          {/*          <div className="mb-2 flex items-center">*/}
          {/*            <Image*/}
          {/*              src={bookings.image_url}*/}
          {/*              className="mr-2 rounded-full"*/}
          {/*              width={28}*/}
          {/*              height={28}*/}
          {/*              alt={`${bookings.name}'s profile picture`}*/}
          {/*            />*/}
          {/*            <p>{bookings.userName}</p>*/}
          {/*          </div>*/}
          {/*          <p className="text-sm text-gray-500">{bookings.email}</p>*/}
          {/*        </div>*/}
          {/*        <BookingStatus status={bookings.status} />*/}
          {/*      </div>*/}
          {/*      <div className="flex w-full items-center justify-between pt-4">*/}
          {/*        <div>*/}
          {/*          <p className="text-xl font-medium">{bookings.duration}</p>*/}
          {/*          <p>{bookings.date.toString()}</p>*/}
          {/*        </div>*/}
          {/*        <div className="flex justify-end gap-2">*/}
          {/*          <UpdateBooking id={bookings.id} />*/}
          {/*          <DeleteBooking id={bookings.id} />*/}
          {/*        </div>*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*  ))}*/}
          {/*</div>*/}
          <table className="hidden min-w-full text-gray-900 md:table text-xl">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr className="text-2xl">
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Клиент
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Тип массажа
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Продолжительность
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Дата/Время
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Статус Бронирования
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Редактировать</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {bookings?.map((booking) => (
                <tr
                  key={booking.id}
                  className="w-full text-xl border-b py-3 last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{booking.user_name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {booking.massage_type}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {booking.duration}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {booking.date}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <BookingStatus status={booking.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateBooking id={booking.id} />
                      <DeleteBooking id={booking.id} />
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
