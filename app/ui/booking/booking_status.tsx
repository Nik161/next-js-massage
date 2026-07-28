import { CheckIcon, ClockIcon, TrophyIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function BookingStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-1 text-xs",
        {
          "bg-gray-100 text-gray-500": status === "booked",
          "bg-green-500 text-white": status === "completed",
          "bg-blue-500 text-white": status === "confirmed",
        },
      )}
    >
      {status === "booked" ? (
        <>
          Booked
          <ClockIcon className="ml-1 w-4 text-gray-500" />
        </>
      ) : null}
      {status === "confirmed" ? (
        <>
          Confirmed
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
      {status === "completed" ? (
        <>
          Completed
          <TrophyIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
    </span>
  );
}
