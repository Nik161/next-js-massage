import Link from "next/link";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { deleteBooking } from "@/app/lib/actions";
import ConfirmModal from "@/app/ui/shared/confirmModal";
import { iconButtonClassName } from "@/app/ui/shared/icon_button";

const ADMIN_ONLY_TITLE = "Доступно только администратору";

export function CreateBooking() {
  return (
    <Link
      href="/bookings/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden text-lg md:block">Записаться на сеанс</span>
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
  // A disabled link would still navigate, so render a plain element instead.
  if (disabled) {
    return (
      <span
        aria-disabled="true"
        title={ADMIN_ONLY_TITLE}
        className={iconButtonClassName(true)}
      >
        <PencilIcon className="w-5" />
      </span>
    );
  }

  return (
    <Link
      href={`/bookings/${id}/edit`}
      title="Изменить запись"
      className={iconButtonClassName()}
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
  return (
    <ConfirmModal
      action={deleteBooking.bind(null, id)}
      title="Подтвердите удаление бронирования"
      message="Вы действительно хотите удалить запись? Это действие нельзя отменить!"
      confirmText="Удалить"
      triggerTitle={disabled ? ADMIN_ONLY_TITLE : "Удалить запись"}
      triggerClassName={iconButtonClassName(disabled)}
      disabled={disabled}
    >
      <span className="sr-only">Удалить</span>
      <TrashIcon className="w-5" />
    </ConfirmModal>
  );
}
