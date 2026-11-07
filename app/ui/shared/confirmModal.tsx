"use client";

import { useEffect, useId, useRef } from "react";
import { useFormStatus } from "react-dom";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/shared/button";
import Spinner from "@/app/ui/shared/spinner";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/hooks";
import {
  modalClosed,
  modalOpened,
  selectOpenModalId,
} from "@/app/lib/store/ui_slice";

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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectOpenModalId) === titleId;
  const open = () => dispatch(modalOpened(titleId));
  const close = () => dispatch(modalClosed(titleId));

  // A modal removed while open (e.g. its row was deleted) must not stay "open".
  useEffect(() => {
    return () => {
      dispatch(modalClosed(titleId));
    };
  }, [dispatch, titleId]);

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
        onClick={open}
        className={triggerClassName}
      >
        {children}
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={close}
        // Clicking the backdrop (the dialog element itself) closes it.
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
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
                onClick={close}
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
