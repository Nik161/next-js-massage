"use client";

import { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function ConfirmModal({
  action,
  actionText,
  buttonText,
  disabled,
}: {
  action: () => Promise<void>;
  actionText: string;
  buttonText: string;
  disabled: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(true)}
        className={clsx("rounded-md border p-2 hover:bg-gray-100", {
          "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-60":
            disabled,
        })}
      >
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-1/3 rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold">Подтвердите {actionText}</h2>

            <p className="mt-2 text-sm text-gray-600 text-wrap ">
              Вы действительно хотите удалить запись? Это действие нельзя
              отменить!
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded border px-4 py-2 hover:bg-gray-100"
              >
                Отмена
              </button>

              <form action={action}>
                <button
                  type="submit"
                  className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                  {buttonText}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
