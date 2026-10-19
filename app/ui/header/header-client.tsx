"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { cormorant } from "@/app/ui/fonts";
import { NAV_LINKS } from "@/app/constants/navigation";
import MassageName from "@/app/ui/shared/massage_name";
import LogoutButton from "@/app/ui/shared/logoutButton";
import { Leaf, PalmFrond } from "@/app/ui/motion/decor";

type HeaderClientProps = {
  isLoggedIn: boolean;
};

export default function HeaderClient({ isLoggedIn }: HeaderClientProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  // Solid background after a bit of scrolling; hide while scrolling down.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 40);
      setIsHidden(y > 400 && y > lastScrollY.current);
      lastScrollY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <nav
        className={clsx(
          "fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-out-expo",
          isHidden && !isMenuOpen ? "-translate-y-full" : "translate-y-0",
          isScrolled && !isMenuOpen
            ? "bg-forest/80 shadow-[0_1px_0_rgb(201_168_76/0.15)] backdrop-blur-xl"
            : "bg-transparent",
        )}
      >
        <div
          className={clsx(
            "mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-500 md:px-8",
            isScrolled ? "h-16" : "h-20 md:h-24",
          )}
        >
          <Link
            href="/"
            onClick={closeMenu}
            className={`${cormorant.className} relative z-50 text-2xl font-medium tracking-[0.04em] text-cream md:text-[1.7rem]`}
          >
            <MassageName />
          </Link>

          {/* Desktop navigation */}
          <ul className="hidden items-center gap-9 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group relative py-2 text-[0.8rem] uppercase tracking-[0.2em] text-cream/75 transition-colors duration-300 hover:text-cream"
                >
                  {link.label}
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-0 bg-gold transition-transform duration-500 ease-out-expo group-hover:origin-left group-hover:scale-x-100" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/bookings"
              className="text-[0.8rem] uppercase tracking-[0.2em] text-cream/75 transition-colors duration-300 hover:text-gold"
            >
              Мои записи
            </Link>
            {isLoggedIn && (
              <LogoutButton className="text-[0.8rem] uppercase tracking-[0.2em] text-cream/75 hover:text-gold [&>span]:sr-only" />
            )}
            <Link
              href="/bookings/create"
              className="shine rounded-full border border-gold/70 bg-gold/10 px-6 py-2.5 text-[0.78rem] font-medium uppercase tracking-[0.2em] text-gold transition-all duration-500 hover:bg-gold hover:text-forest hover:shadow-[0_0_30px_rgb(201_168_76/0.35)]"
            >
              Записаться
            </Link>
          </div>

          {/* Burger */}
          <button
            onClick={() => setIsMenuOpen((open) => !open)}
            className="relative z-50 flex size-11 flex-col items-center justify-center gap-1.5 md:hidden"
            aria-label="Меню"
            aria-expanded={isMenuOpen}
          >
            <span
              className={clsx(
                "h-px w-7 bg-cream transition-all duration-500 ease-out-expo",
                isMenuOpen && "translate-y-[3.5px] rotate-45",
              )}
            />
            <span
              className={clsx(
                "h-px bg-cream transition-all duration-500 ease-out-expo",
                isMenuOpen
                  ? "w-7 -translate-y-[3.5px] -rotate-45"
                  : "w-5 self-end mr-2",
              )}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={clsx(
          "grain fixed inset-0 z-40 overflow-hidden bg-forest transition-[clip-path] duration-700 ease-out-expo md:hidden",
          isMenuOpen
            ? "[clip-path:circle(150%_at_calc(100%-2.5rem)_2.5rem)]"
            : "pointer-events-none [clip-path:circle(0%_at_calc(100%-2.5rem)_2.5rem)]",
        )}
      >
        <PalmFrond className="absolute -bottom-10 -right-16 h-[420px] text-gold/15 animate-sway origin-bottom" />
        <Leaf className="absolute left-6 top-28 h-24 text-gold/15 animate-float" />

        {isMenuOpen && (
          <div className="relative flex h-full flex-col justify-center px-8 pt-16">
            <ul className="space-y-2">
              {NAV_LINKS.map((link, i) => (
                <li
                  key={link.href}
                  className="animate-slide-in-right"
                  style={{ animationDelay: `${150 + i * 60}ms` }}
                >
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className="flex items-baseline gap-4 py-2 font-display text-4xl font-light text-cream"
                  >
                    <span className="text-xs text-gold">0{i + 1}</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-12 flex animate-fade-up flex-col gap-4 [animation-delay:550ms]">
              <Link
                href="/bookings/create"
                onClick={closeMenu}
                className="rounded-full bg-gold py-4 text-center text-sm font-medium uppercase tracking-[0.2em] text-forest"
              >
                Записаться на сеанс
              </Link>
              <div className="flex items-center justify-between text-sm uppercase tracking-[0.2em] text-cream/70">
                <Link href="/bookings" onClick={closeMenu}>
                  Мои записи
                </Link>
                {isLoggedIn && <LogoutButton className="hover:text-gold" />}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
