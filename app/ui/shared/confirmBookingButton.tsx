"use client";

import { useTransition } from "react";
import { setBookingStatus } from "@/app/lib/actions";
import { CheckIcon } from "@heroicons/react/24/outline";

type ConfirmBookingButtonProps = {
  bookingId: string;
};

export default function ConfirmBookingButton({
  bookingId,
}: ConfirmBookingButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      await setBookingStatus(bookingId, "confirmed");
    });
  };

  return (
    <button
      type="button"
      onClick={handleConfirm}
      disabled={isPending}
      title="Подтвердить"
      className="
        rounded-md
        border border-blue-600
        px-4 py-2
        text-sm
        font-medium
        text-blue-700
        transition-colors
        hover:bg-blue-600
        hover:text-white
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      <CheckIcon className="w-5" />
    </button>
  );
}
