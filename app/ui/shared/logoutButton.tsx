"use client";

import { signOut } from "next-auth/react";
import clsx from "clsx";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";

export default function LogoutButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => signOut({ redirectTo: "/" })}
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
