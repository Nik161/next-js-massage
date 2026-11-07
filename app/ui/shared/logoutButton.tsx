"use client";

import { signOut } from "next-auth/react";
import clsx from "clsx";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { useAppDispatch } from "@/app/lib/store/hooks";
import { userSignedOut } from "@/app/lib/store/user_slice";

export default function LogoutButton({ className }: { className?: string }) {
  const dispatch = useAppDispatch();

  return (
    <button
      type="button"
      onClick={() => {
        dispatch(userSignedOut());
        signOut({ redirectTo: "/" });
      }}
      title="Выйти"
      className={clsx(
        "group inline-flex items-center gap-2 transition-colors duration-300",
        className,
      )}
    >
      <ArrowRightStartOnRectangleIcon className="size-5 transition-transform duration-300 group-hover:translate-x-0.5" />
      <span>Выйти</span>
    </button>
  );
}
