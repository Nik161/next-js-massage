export function BookingTableSkeleton() {
  return (
    <div className="mt-6 overflow-hidden rounded-3xl border border-line bg-white shadow-soft">
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b border-line p-5 last:border-b-0"
        >
          <div className="skeleton size-11 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-1/3" />
            <div className="skeleton h-3 w-1/4" />
          </div>
          <div className="skeleton hidden h-4 w-24 md:block" />
          <div className="skeleton hidden h-6 w-28 rounded-full md:block" />
        </div>
      ))}
    </div>
  );
}

export function BookingsPageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16">
      <div className="relative z-10 -mt-12 rounded-3xl border border-line bg-white/90 p-6 shadow-lift backdrop-blur md:p-8">
        <div className="skeleton h-9 w-56" />
        <div className="mt-6 flex gap-3">
          <div className="skeleton h-12 flex-1 rounded-full" />
          <div className="skeleton h-12 w-12 rounded-full md:w-56" />
        </div>
      </div>
      <BookingTableSkeleton />
    </div>
  );
}

export function SlotsSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} className="skeleton h-12" />
      ))}
    </div>
  );
}
