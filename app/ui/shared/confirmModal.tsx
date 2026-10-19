"use client";

import { useId, useState } from "react";

export default function ConfirmModal({
  action,
  title,
  message,
  confirmText,
  triggerTitle,
  triggerClassName,
  disabled = false,
  children,
}: {
  action: () => Promise<void>;
  title: string;
  message: string;
  confirmText: string;
  triggerTitle?: string;
  triggerClassName?: string;
  disabled?: boolean;
  // Content of the button that opens the modal
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        title={triggerTitle}
        onClick={() => setIsOpen(true)}
        className={triggerClassName}
      >
        {children}
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
        >
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 id={titleId} className="text-lg font-semibold">
              {title}
            </h2>

            <p className="mt-2 text-sm text-wrap text-gray-600">{message}</p>

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
                  {confirmText}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
