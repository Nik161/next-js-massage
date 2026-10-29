import { Suspense } from "react";
import Search from "@/app/ui/shared/search";
import Pagination from "@/app/ui/shared/pagination";
import { CreateBooking } from "@/app/ui/booking/buttons";
import BalanceBadge from "@/app/ui/booking/balance_badge";
import BookingTable from "@/app/ui/booking/table";
import { BookingTableSkeleton } from "@/app/ui/booking/skeletons";
import { fetchBookingsPages } from "@/app/lib/data/bookings";
import { requireCurrentUser } from "@/app/lib/session";
import { bookingsOwnerFilter } from "@/app/lib/permissions";

export default async function Page(props: {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams.query || "";
  const currentPage = Number(searchParams.page) || 1;
  const user = await requireCurrentUser();
  const totalPages = await fetchBookingsPages(query, bookingsOwnerFilter(user));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16">
      <div className="relative z-10 -mt-12 animate-fade-up rounded-3xl border border-line bg-white/90 p-6 shadow-lift backdrop-blur md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold-dark">
              Личный кабинет
            </p>
            <h1 className="mt-1 font-display text-3xl font-medium text-ink md:text-4xl">
              Ваши <em className="text-terracotta">массажи</em>
            </h1>
          </div>
          <BalanceBadge minutes={user.balance} />
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Search placeholder="Искать по имени, email, дате…" />
          <CreateBooking />
        </div>
      </div>

      {/* Re-mounting on query/page change shows the skeleton while loading */}
      <Suspense
        key={`${query}-${currentPage}`}
        fallback={<BookingTableSkeleton />}
      >
        <BookingTable query={query} currentPage={currentPage} />
      </Suspense>

      <div className="mt-8 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
