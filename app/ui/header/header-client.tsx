"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import MassageName from "@/app/ui/shared/massage_name";
import { cormorant } from "@/app/ui/fonts";
import LogoutButton from "@/app/ui/shared/logoutButton";

type HeaderClientProps = {
  isLoggedIn: boolean;
};

export default function HeaderClient({ isLoggedIn }: HeaderClientProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-[5vw] h-16 sm:h-17 md:h-18 flex items-center justify-between transition-all duration-500 ${
          scrolled
            ? "bg-[#1a2e1b]/90 backdrop-blur-lg shadow-[0_1px_0_rgba(201,168,76,0.2)]"
            : "bg-transparent"
        }`}
      >
        {/* Логотип */}
        <Link
          href="/"
          className={`${cormorant.className} text-xl sm:text-2xl md:text-2xl font-semibold tracking-[0.05em] text-[#f5ede0] no-underline flex items-center gap-2 z-50`}
        >
          <MassageName />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex gap-10">
          <Link
            href="/bookings/create"
            className="text-[0.7rem] lg:text-[0.75rem] tracking-[0.18em] uppercase
              font-medium px-4 lg:px-6 py-2 lg:py-2.5
              border border-[#c9a84c] text-[#c9a84c] bg-transparent
              cursor-pointer transition-all duration-300
              hover:bg-[#c9a84c] hover:text-[#1a2e1b]
              font-['Jost',sans-serif]"
          >
            Записаться
          </Link>
          <Link
            href="/bookings"
            className="text-[0.7rem] lg:text-[0.75rem] tracking-[0.18em] uppercase
              font-medium px-4 lg:px-6 py-2 lg:py-2.5
              border border-[#c9a84c] text-[#c9a84c] bg-transparent
              cursor-pointer transition-all duration-300
              hover:bg-[#c9a84c] hover:text-[#1a2e1b]
              font-['Jost',sans-serif]"
          >
            Мои записи
          </Link>

          {isLoggedIn && <LogoutButton />}
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden relative z-50 w-8 h-8 flex flex-col justify-center items-center gap-1.5 cursor-pointer group"
          aria-label="Меню"
          aria-expanded={mobileMenuOpen}
        >
          <span
            className={`w-6 h-0.5 bg-[#f5ede0] transition-all duration-300 ${
              mobileMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />

          <span
            className={`w-6 h-0.5 bg-[#f5ede0] transition-all duration-300 ${
              mobileMenuOpen ? "opacity-0" : ""
            }`}
          />

          <span
            className={`w-6 h-0.5 bg-[#f5ede0] transition-all duration-300 ${
              mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#1a2e1b] transition-all duration-500 md:hidden ${
          mobileMenuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center justify-center min-h-screen pt-20 pb-8 px-6 gap-2">
          <Link
            href="/bookings/create"
            onClick={handleLinkClick}
            className="text-[0.8rem] tracking-[0.2em] uppercase
              font-medium px-8 py-3
              border-2 border-[#c9a84c] text-[#c9a84c]
              bg-transparent cursor-pointer transition-all duration-300
              hover:bg-[#c9a84c] hover:text-[#1a2e1b]
              font-['Jost',sans-serif]"
            style={{
              animation: `fadeInUp 0.4s ease-out forwards`,
              animationDelay: "0.3s",
              opacity: 0,
            }}
          >
            Записаться
          </Link>

          <Link
            href="/bookings"
            onClick={handleLinkClick}
            className="text-[0.8rem] tracking-[0.2em] uppercase
                font-medium px-8 py-3
                border-2 border-[#c9a84c] text-[#c9a84c]
                bg-transparent cursor-pointer transition-all duration-300
                hover:bg-[#c9a84c] hover:text-[#1a2e1b]
                font-['Jost',sans-serif]"
            style={{
              animation: `fadeInUp 0.4s ease-out forwards`,
              animationDelay: "0.3s",
              opacity: 0,
            }}
          >
            Мои Записи
          </Link>

          {isLoggedIn && <LogoutButton />}

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-[0.65rem] tracking-[0.2em] text-[#c9a84c]/50">
            ✦ Niko Massage Studio ✦
          </div>
        </div>
      </div>
    </>
  );
}
