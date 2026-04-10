"use client";

import { useState, useEffect } from "react";
import MassageName from "@/app/ui/massage_name";

export default function Header() {
  const NAV_LINKS = [
    "Услуги",
    "О нас",
    "Галерея",
    "Цены",
    "Контакты",
    "Мастера",
  ];
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-100 px-[5vw] h-[72px] flex items-center justify-between transition-all duration-500 ${
        scrolled
          ? "bg-[#1a2e1b]/90 backdrop-blur-lg shadow-[0_1px_0_rgba(201,168,76,0.2)]"
          : ""
      }`}
    >
      <a
        href="#"
        className="font-['Cormorant_Garamond',serif] text-2xl font-semibold tracking-[0.05em] text-[#f5ede0] no-underline flex items-center gap-2.5"
      >
        <MassageName />
      </a>

      <ul className="hidden md:flex gap-10 list-none">
        {NAV_LINKS.map((l) => (
          <li key={l}>
            <a
              href="#"
              className="text-[0.78rem] font-normal tracking-[0.18em] uppercase text-[#f5ede0]/80 no-underline transition-colors duration-300 pb-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-[#c9a84c] after:transition-all after:duration-300 hover:text-[#c9a84c] hover:after:w-full"
            >
              {l}
            </a>
          </li>
        ))}
      </ul>

      <button className="hidden md:block text-[0.75rem] tracking-[0.18em] uppercase font-medium px-6 py-2.5 border border-[#c9a84c] text-[#c9a84c] bg-transparent cursor-pointer transition-all duration-300 hover:bg-[#c9a84c] hover:text-[#1a2e1b] font-['Jost',sans-serif]">
        Записаться
      </button>

      <button
        className="md:hidden flex flex-col gap-1 bg-transparent border-none cursor-pointer p-1"
        aria-label="Меню"
      >
        <span className="block w-[26px] h-[1.5px] bg-[#f5ede0] transition-all duration-300" />
        <span className="block w-[26px] h-[1.5px] bg-[#f5ede0] transition-all duration-300" />
        <span className="block w-[26px] h-[1.5px] bg-[#f5ede0] transition-all duration-300" />
      </button>
    </nav>
  );
}
