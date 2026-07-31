"use client";

import { useState, useEffect } from "react";
import MassageName from "@/app/ui/shared/massage_name";
import Link from "next/link";
import { cormorant } from "@/app/ui/fonts";

export default function Header() {
  const NAV_LINKS = ["Услуги", "О нас", "Мастера"];

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Блокируем скролл при открытом мобильном меню
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

        {/* Десктопное меню (md и выше) */}
        {/*<ul className="hidden md:flex gap-6 lg:gap-10 list-none items-center">*/}
        {/*  {NAV_LINKS.map((l) => (*/}
        {/*    <li key={l}>*/}
        {/*      <a*/}
        {/*        href="#"*/}
        {/*        className="text-[0.7rem] lg:text-[0.78rem] font-normal tracking-[0.18em] uppercase text-[#f5ede0]/80 no-underline transition-all duration-300 pb-1 relative*/}
        {/*          after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-[#c9a84c] after:transition-all after:duration-300*/}
        {/*          hover:text-[#c9a84c] hover:after:w-full"*/}
        {/*      >*/}
        {/*        {l}*/}
        {/*      </a>*/}
        {/*    </li>*/}
        {/*  ))}*/}
        {/*</ul>*/}

        {/* Десктопная кнопка */}
        <div className="flex gap-10">
          <Link
            href="/bookings/create"
            className="hidden md:block text-[0.7rem] lg:text-[0.75rem] tracking-[0.18em] uppercase
             font-medium px-4 lg:px-6 py-2 lg:py-2.5 border border-[#c9a84c] text-[#c9a84c] bg-transparent
              cursor-pointer transition-all duration-300 hover:bg-[#c9a84c] hover:text-[#1a2e1b] font-['Jost',sans-serif]"
          >
            Записаться
          </Link>
          <Link
            href="/bookings"
            className="hidden md:block text-[0.7rem] lg:text-[0.75rem] tracking-[0.18em] uppercase
             font-medium px-4 lg:px-6 py-2 lg:py-2.5 border border-[#c9a84c] text-[#c9a84c] bg-transparent
              cursor-pointer transition-all duration-300 hover:bg-[#c9a84c] hover:text-[#1a2e1b] font-['Jost',sans-serif]"
          >
            Мои Записи
          </Link>
        </div>

        {/* Мобильная кнопка-бургер (до md) */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden relative z-50 w-8 h-8 flex flex-col justify-center items-center gap-1.5 cursor-pointer group"
          aria-label="Меню"
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

      {/* Мобильное меню (overlay) */}
      <div
        className={`fixed inset-0 z-40 bg-[#1a2e1b] transition-all duration-500 md:hidden ${
          mobileMenuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center justify-center min-h-screen pt-20 pb-8 px-6">
          {/* Мобильные навигационные ссылки */}
          {/*<ul className="flex flex-col items-center gap-6 mb-12">*/}
          {/*  {NAV_LINKS.map((l, index) => (*/}
          {/*    <li*/}
          {/*      key={l}*/}
          {/*      style={{*/}
          {/*        animation: `fadeInUp 0.4s ease-out forwards`,*/}
          {/*        animationDelay: `${index * 0.05}s`,*/}
          {/*        opacity: 0,*/}
          {/*      }}*/}
          {/*    >*/}
          {/*      <a*/}
          {/*        href="#"*/}
          {/*        onClick={handleLinkClick}*/}
          {/*        className="text-[1.1rem] font-normal tracking-[0.2em] uppercase text-[#f5ede0]/90 no-underline transition-all duration-300 hover:text-[#c9a84c] hover:tracking-[0.25em] block py-2"*/}
          {/*      >*/}
          {/*        {l}*/}
          {/*      </a>*/}
          {/*    </li>*/}
          {/*  ))}*/}
          {/*</ul>*/}

          {/* Мобильная кнопка записи */}
          <Link
            href="/bookings"
            onClick={handleLinkClick}
            className="text-[0.8rem] tracking-[0.2em] uppercase font-medium px-8 py-3 border-2 border-[#c9a84c] text-[#c9a84c] bg-transparent cursor-pointer transition-all duration-300 hover:bg-[#c9a84c] hover:text-[#1a2e1b] font-['Jost',sans-serif]"
            style={{
              animation: `fadeInUp 0.4s ease-out forwards`,
              animationDelay: "0.3s",
              opacity: 0,
            }}
          >
            Записаться
          </Link>

          {/* Декоративный элемент */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-[0.65rem] tracking-[0.2em] text-[#c9a84c]/50">
            ✦ Niko Massage Studio ✦
          </div>
        </div>
      </div>
    </>
  );
}
