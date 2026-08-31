"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ redirectTo: "/" })}
      className="text-[0.8rem] tracking-[0.2em] uppercase font-medium px-8 py-2 border-2 border-[#c9a84c] text-[#c9a84c] bg-transparent cursor-pointer transition-all duration-300 hover:bg-[#c9a84c] hover:text-[#1a2e1b] font-['Jost',sans-serif]"
    >
      Выйти
    </button>
  );
}
