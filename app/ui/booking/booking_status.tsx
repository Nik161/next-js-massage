import {
  CheckIcon,
  ClockIcon,
  TrophyIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import type { BookingStatus as Status } from "@/app/lib/definitions";

const STATUS_CONFIG: Record<
  Status,
  {
    label: string;
    icon: typeof ClockIcon;
    className: string;
    iconClassName: string;
  }
> = {
  booked: {
    label: "Booked",
    icon: ClockIcon,
    className: "bg-gray-100 text-gray-600 ring-gray-200",
    iconClassName: "text-gray-500",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckIcon,
    className: "bg-gray-900 text-white ring-gray-900/10",
    iconClassName: "text-white",
  },
  completed: {
    label: "Completed",
    icon: TrophyIcon,
    className: "bg-gray-100 text-gray-900 ring-gray-200",
    iconClassName: "text-gray-700",
  },
  canceled: {
    label: "Canceled",
    icon: XMarkIcon,
    className: "bg-white text-gray-400 ring-gray-200",
    iconClassName: "text-gray-400",
  },
};

export default function BookingStatus({ status }: { status: Status }) {
  const config = STATUS_CONFIG[status];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5",
        "text-sm font-medium tracking-wide",
        "ring-1 ring-inset",
        config.className,
      )}
    >
      <Icon className={clsx("h-4.5 w-4.5", config.iconClassName)} />
      {config.label}
    </span>
  );
}
