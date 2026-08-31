"use client";

import { useTransition } from "react";
import { setBookingStatus } from "@/app/lib/actions";

type ConfirmBookingButtonProps = {
  bookingId: string;
};

export default function CompleteBookingButton({
  bookingId,
}: ConfirmBookingButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      await setBookingStatus(bookingId, "completed");
    });
  };

  return (
    <button
      type="button"
      onClick={handleConfirm}
      disabled={isPending}
      className="
        rounded-md
        border border-green-600
        px-4 py-2
        text-sm
        font-medium
        text-green-700
        transition-colors
        hover:bg-green-600
        hover:text-white
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      {isPending ? "Загрузка..." : "Завершить"}
    </button>
  );
}
