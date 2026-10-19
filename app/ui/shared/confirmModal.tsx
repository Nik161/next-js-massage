"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/shared/button";
import Spinner from "@/app/ui/shared/spinner";

function ConfirmButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="accent"
      disabled={pending}
      className="h-11 px-5"
    >
      {pending && <Spinner />}
      {children}
    </Button>
  );
}

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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  // The native <dialog> gives us focus trapping and Escape handling for free.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

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

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={() => setIsOpen(false)}
        // Clicking the backdrop (the dialog element itself) closes it.
        onClick={(event) => {
          if (event.target === event.currentTarget) setIsOpen(false);
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl bg-white p-0 text-ink shadow-lift open:animate-scale-in backdrop:bg-forest-deep/50 backdrop:backdrop-blur-sm"
      >
        {isOpen && (
          <div className="p-7">
            <div className="flex size-12 animate-pop items-center justify-center rounded-full bg-terracotta-soft text-terracotta">
              <ExclamationTriangleIcon className="size-6" />
            </div>

            <h2 id={titleId} className="mt-5 font-display text-2xl font-medium">
              {title}
            </h2>

            <p className="mt-2 leading-relaxed text-muted">{message}</p>

            <div className="mt-7 flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="h-11 px-5"
              >
                Отмена
              </Button>

              <form action={action}>
                <ConfirmButton>{confirmText}</ConfirmButton>
              </form>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
