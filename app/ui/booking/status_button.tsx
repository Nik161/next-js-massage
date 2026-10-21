"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { CheckBadgeIcon, CheckIcon } from "@heroicons/react/24/outline";
import { setBookingStatus } from "@/app/lib/api_client";
import type { ManualBookingStatus } from "@/app/lib/definitions";
import { iconButtonClassName } from "@/app/ui/shared/icon_button";
import Spinner from "@/app/ui/shared/spinner";

const STATUS_BUTTONS = {
  confirmed: { title: "Подтвердить", tone: "gold", Icon: CheckIcon },
  completed: { title: "Завершить", tone: "forest", Icon: CheckBadgeIcon },
} as const satisfies Record<ManualBookingStatus, object>;

export default function SetBookingStatusButton({
  bookingId,
  status,
}: {
  bookingId: string;
  status: ManualBookingStatus;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { title, tone, Icon } = STATUS_BUTTONS[status];

  return (
    <button
      type="button"
      onClick={() =>
        startTransition(async () => {
          await setBookingStatus(bookingId, status);
          router.refresh();
        })
      }
      disabled={isPending}
      title={title}
      className={iconButtonClassName(false, tone)}
    >
      {isPending ? <Spinner /> : <Icon className="size-4" />}
    </button>
  );
}
