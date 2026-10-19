import Link from "next/link";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { deleteBooking } from "@/app/lib/actions";
import ConfirmModal from "@/app/ui/shared/confirmModal";
import { buttonClassName } from "@/app/ui/shared/button";
import { iconButtonClassName } from "@/app/ui/shared/icon_button";

const ADMIN_ONLY_TITLE = "Доступно только администратору";

export function CreateBooking() {
  return (
    <Link
      href="/bookings/create"
      className={buttonClassName("accent", "group shrink-0 px-4 md:px-6")}
    >
      <PlusIcon className="size-5 transition-transform duration-300 group-hover:rotate-90" />
      <span className="hidden md:inline">Записаться на сеанс</span>
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
        <PencilIcon className="size-4" />
      </span>
    );
  }

  return (
    <Link
      href={`/bookings/${id}/edit`}
      title="Изменить запись"
      className={iconButtonClassName()}
    >
      <PencilIcon className="size-4" />
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
      title="Удалить бронирование?"
      message="Запись будет удалена без возможности восстановления."
      confirmText="Удалить"
      triggerTitle={disabled ? ADMIN_ONLY_TITLE : "Удалить запись"}
      triggerClassName={iconButtonClassName(disabled, "danger")}
      disabled={disabled}
    >
      <span className="sr-only">Удалить</span>
      <TrashIcon className="size-4" />
    </ConfirmModal>
  );
}
