import clsx from "clsx";
import type { BookingStatus as Status } from "@/app/lib/definitions";

const STATUS_CONFIG: Record<
  Status,
  { label: string; className: string; dotClassName: string }
> = {
  booked: {
    label: "Ожидает",
    className: "bg-gold-soft text-gold-dark ring-gold/30",
    dotClassName: "bg-gold animate-soft-pulse",
  },
  confirmed: {
    label: "Подтверждён",
    className: "bg-sage text-forest ring-forest/15",
    dotClassName: "bg-forest-soft",
  },
  completed: {
    label: "Завершён",
    className: "bg-sand text-muted ring-line",
    dotClassName: "bg-muted/50",
  },
  canceled: {
    label: "Отменён",
    className: "bg-terracotta-soft text-terracotta ring-terracotta/20",
    dotClassName: "bg-terracotta",
  },
};

export default function BookingStatus({ status }: { status: Status }) {
  const config = STATUS_CONFIG[status];
  if (!config) return null;

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium tracking-wide ring-1 ring-inset",
        config.className,
      )}
    >
      <span className={clsx("size-1.5 rounded-full", config.dotClassName)} />
      {config.label}
    </span>
  );
}
