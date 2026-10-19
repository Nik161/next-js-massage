"use client";

import { useTransition } from "react";
import clsx from "clsx";
import { CheckIcon } from "@heroicons/react/24/outline";
import { setBookingStatus } from "@/app/lib/actions";
import type { ManualBookingStatus } from "@/app/lib/definitions";

const STATUS_BUTTONS: Record<
  ManualBookingStatus,
  { title: string; className: string }
> = {
  confirmed: {
    title: "Подтвердить",
    className: "border-blue-600 text-blue-700 hover:bg-blue-600",
  },
  completed: {
    title: "Завершить",
    className: "border-green-600 text-green-700 hover:bg-green-600",
  },
};

export default function SetBookingStatusButton({
  bookingId,
  status,
}: {
  bookingId: string;
  status: ManualBookingStatus;
}) {
  const [isPending, startTransition] = useTransition();
  const { title, className } = STATUS_BUTTONS[status];

  return (
    <button
      type="button"
      onClick={() =>
        startTransition(async () => {
          await setBookingStatus(bookingId, status);
        })
      }
      disabled={isPending}
      title={title}
      className={clsx(
        "rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      <CheckIcon className="w-5" />
    </button>
  );
}
