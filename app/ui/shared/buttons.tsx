import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { deleteBooking } from "@/app/lib/actions";
import ConfirmModal from "@/app/ui/shared/confirmModal";
import clsx from "clsx";

export function CreateBooking() {
  return (
    <Link
      href="/app/(main)/bookings/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors
      hover:bg-blue-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block text-lg">Записаться на сеанс</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateBooking({
  id,
  disabled,
}: {
  id: string;
  disabled: boolean;
}) {
  return (
    <Link
      href={`/bookings/${id}/edit`}
      title={disabled ? "You can't edit completed booking" : "Edit booking"}
      className={clsx("rounded-md border p-2 hover:bg-gray-100", {
        "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-60":
          disabled,
      })}
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteBooking({
  id,
  disabled,
}: {
  id: string;
  disabled: boolean;
}) {
  const deleteBookingWithId = deleteBooking.bind(null, id);
  return (
    <ConfirmModal
      action={deleteBookingWithId}
      actionText="удаление бронирования"
      buttonText="Удалить"
      disabled={disabled}
    />
  );

  // return (
  //   <form action={deleteBookingWithId}>
  //     <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
  //       <span className="sr-only">Delete</span>
  //       <TrashIcon className="w-5" />
  //     </button>
  //   </form>
  // );
}
