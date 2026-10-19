import Image from "next/image";
import Link from "next/link";
import { ArrowDownIcon } from "@heroicons/react/24/outline";
import Reveal from "@/app/ui/motion/reveal";
import SplitWords from "@/app/ui/motion/split_words";
import Parallax from "@/app/ui/motion/parallax";
import PointerParallax from "@/app/ui/motion/pointer_parallax";
import Magnetic from "@/app/ui/motion/magnetic";
import {
  GoldDust,
  Leaf,
  PalmFrond,
  RotatingBadge,
} from "@/app/ui/motion/decor";

export default function Hero() {
  return (
    <section
      id="top"
      className="grain relative flex h-svh min-h-[680px] items-end overflow-hidden bg-forest pb-20 md:items-center md:pb-0"
    >
      {/* Background photo: slow zoom + scroll parallax */}
      <Parallax speed={-0.25} className="absolute -inset-y-[12%] inset-x-0">
        <Image
          src="/images/main_hero.jpeg"
          alt=""
          fill
          preload
          sizes="100vw"
          className="animate-slowzoom object-cover"
        />
      </Parallax>

      <div className="absolute inset-0 bg-linear-to-r from-forest via-forest/70 to-forest/10" />
      <div className="absolute inset-0 bg-linear-to-t from-forest via-transparent to-forest/50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgb(181_99_58/0.25),transparent_55%)]" />

      {/* Botanical layer that follows the mouse */}
      <PointerParallax
        depth={18}
        className="pointer-events-none absolute inset-0"
      >
        <PalmFrond className="absolute -right-20 -top-10 h-[620px] origin-bottom rotate-[200deg] text-gold/20 animate-sway" />
        <Leaf className="absolute bottom-24 right-[18%] h-36 text-gold/25 animate-float" />
      </PointerParallax>
      <PointerParallax
        depth={-28}
        className="pointer-events-none absolute inset-0"
      >
        <PalmFrond className="absolute -bottom-32 -left-24 h-[560px] origin-bottom rotate-[25deg] text-gold/15 animate-sway [animation-delay:-3s]" />
        <Leaf className="absolute right-[38%] top-[18%] h-16 rotate-45 text-cream/20 animate-float [animation-delay:-2s]" />
      </PointerParallax>
      <GoldDust />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 md:px-8">
        <div className="max-w-3xl text-cream">
          <Reveal variant="none">
            <div className="flex items-center gap-4 text-[0.7rem] uppercase tracking-[0.4em] text-gold md:text-xs">
              <span className="grow-line h-px w-12 bg-gold" />
              Массажный салон · Ритуалы Бали
            </div>

            <h1 className="mt-8 font-display text-[clamp(3.2rem,9vw,7.5rem)] font-light leading-[0.92] tracking-[-0.02em]">
              <span className="block">
                <SplitWords text="Твоё тело" />
              </span>
              <em className="block italic text-gold">
                <SplitWords text="заслуживает" offset={2} />
              </em>
              <span className="block">
                <SplitWords text="расслабиться" offset={3} />
              </span>
            </h1>
          </Reveal>

          <Reveal variant="blur" delay={600}>
            <p className="mt-8 max-w-md text-[1.05rem] font-light leading-relaxed text-cream/75">
              Лучшие массажные практики, собранные со всего мира. Ваше тело
              заслуживает настоящего отдыха.
            </p>
          </Reveal>

          <Reveal
            variant="up"
            delay={800}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Magnetic>
              <Link
                href="/bookings/create"
                className="shine inline-flex items-center gap-3 rounded-full bg-terracotta px-9 py-4 text-[0.8rem] font-medium uppercase tracking-[0.2em] text-cream shadow-[0_20px_40px_-12px_rgb(181_99_58/0.6)] transition-colors duration-500 hover:bg-terracotta-light"
              >
                Записаться на сеанс
              </Link>
            </Magnetic>
            <Link
              href="#rituals"
              className="group inline-flex items-center gap-3 px-4 py-4 text-[0.8rem] uppercase tracking-[0.2em] text-cream/80 transition-colors hover:text-gold"
            >
              Наши ритуалы
              <span className="flex size-9 items-center justify-center rounded-full border border-cream/30 transition-all duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-forest">
                <ArrowDownIcon className="size-4 transition-transform duration-500 group-hover:translate-y-0.5" />
              </span>
            </Link>
          </Reveal>
        </div>
      </div>

      {/* Rotating badge linking to the next section */}
      <Reveal
        variant="scale"
        delay={1100}
        className="absolute bottom-10 right-6 z-10 hidden md:block lg:right-12"
      >
        <Link
          href="#about"
          aria-label="Листать вниз"
          className="group block text-cream/80"
        >
          <RotatingBadge text="Niko Massage · Ритуалы Бали · Покой · ">
            <span className="flex size-12 items-center justify-center rounded-full bg-gold text-forest transition-transform duration-500 group-hover:scale-110">
              <ArrowDownIcon className="size-5" />
            </span>
          </RotatingBadge>
        </Link>
      </Reveal>

      {/* Scroll hint */}
      <Reveal
        variant="fade"
        delay={1300}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
      >
        <span className="text-[0.62rem] uppercase tracking-[0.4em] text-cream/50">
          Листайте
        </span>
        <span className="h-12 w-px origin-top animate-scrollpulse bg-linear-to-b from-gold to-transparent" />
      </Reveal>
    </section>
  );
}
