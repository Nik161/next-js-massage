import { ClockIcon } from "@heroicons/react/24/outline";

// Minutes the user can still spend on bookings this week
export default function BalanceBadge({ minutes }: { minutes: number }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-sage px-3 py-1.5 text-sm text-forest ring-1 ring-inset ring-forest/15">
      <ClockIcon className="size-4" />
      На балансе
      <strong className="font-medium">{minutes} мин.</strong>
    </span>
  );
}
