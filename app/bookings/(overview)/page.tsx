import { cormorant } from "@/app/ui/fonts";
import Search from "@/app/ui/shared/search";
import Pagination from "@/app/ui/shared/pagination";
import { CreateBooking } from "@/app/ui/booking/buttons";
import BookingTable from "@/app/ui/booking/table";
import { fetchBookingsPages } from "@/app/lib/data/bookings";

export default async function Page(props: {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams.query || "";
  const currentPage = Number(searchParams.page) || 1;
  const totalPages = await fetchBookingsPages(query);

  return (
    <div className="flex min-h-screen flex-col items-center">
      <div className="min-w-3/4">
        <h1 className={`${cormorant.className} m-4 text-xl md:text-3xl`}>
          Ваши массажи
        </h1>

        <div className="flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="Искать сеансы..." />
          <CreateBooking />
        </div>

        <BookingTable query={query} currentPage={currentPage} />

        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}
