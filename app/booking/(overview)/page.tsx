import { cormorant } from "@/app/ui/fonts";
import Search from "@/app/ui/shared/search";
import { CreateBooking } from "@/app/ui/shared/buttons";
import Pagination from "@/app/ui/shared/pagination";
import BookingTable from "@/app/ui/booking/table";
import { fetchFilteredBookings } from "@/app/lib/data";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  // const totalPages = await fetchInvoicesPages(query);
  const bookings = await fetchFilteredBookings(query, currentPage);
  console.log("bookings", bookings);

  return (
    <div className="min-h-screen">
      <main>
        <div className="flex flex-col justify-center items-center">
          <div className="min-w-3/4">
            <h1 className={`${cormorant.className} m-4 text-xl md:text-2xl`}>
              Ваши массажи
            </h1>
            <div className="flex items-center justify-between gap-2 md:mt-8">
              <Search placeholder="Искать сеансы..." />
              <CreateBooking />
            </div>
            <BookingTable query={query} currentPage={currentPage} />
            <div className="mt-5 flex w-full justify-center">
              <Pagination totalPages={3} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
