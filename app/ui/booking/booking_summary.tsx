import clsx from "clsx";
import { formatLongDate } from "@/app/lib/booking_time";

function SummaryRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-cream/10 py-3 last:border-b-0">
      <dt className="text-sm text-cream/60">{label}</dt>
      {/* Keyed by value so every change fades in */}
      <dd
        key={value ?? "empty"}
        className={clsx(
          "animate-fade-in text-right",
          value ? "font-medium text-cream" : "text-cream/30",
        )}
      >
        {value ?? "—"}
      </dd>
    </div>
  );
}

// Live overview of the booking being made
export default function BookingSummary({
  userName,
  therapistName,
  massageName,
  duration,
  date,
  time,
}: {
  userName: string;
  therapistName?: string;
  massageName?: string;
  duration?: number;
  date?: string;
  time?: string;
}) {
  return (
    <aside className="relative animate-fade-up overflow-hidden rounded-3xl bg-forest p-6 text-cream shadow-lift [animation-delay:120ms]">
      <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-gold/15 blur-2xl" />

      <p className="text-xs uppercase tracking-[0.3em] text-gold">
        Ваша запись
      </p>
      <p className="mt-2 font-display text-2xl">{userName}</p>

      <dl className="mt-4">
        <SummaryRow label="Массажист" value={therapistName} />
        <SummaryRow label="Программа" value={massageName} />
        <SummaryRow
          label="Длительность"
          value={duration ? `${duration} мин` : undefined}
        />
        <SummaryRow
          label="Дата"
          value={date ? formatLongDate(date) : undefined}
        />
        <SummaryRow label="Время" value={time || undefined} />
      </dl>
    </aside>
  );
}
