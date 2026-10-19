import Image from "next/image";
import Reveal from "@/app/ui/motion/reveal";
import SplitWords from "@/app/ui/motion/split_words";
import Parallax from "@/app/ui/motion/parallax";
import { GoldDust, Leaf, PalmFrond } from "@/app/ui/motion/decor";

export default function HeroBooking() {
  return (
    <section className="grain relative flex min-h-[26rem] items-center justify-center overflow-hidden bg-forest pb-20 pt-24 md:min-h-[30rem]">
      <Parallax speed={-0.2} className="absolute -inset-y-[15%] inset-x-0">
        <Image
          src="/images/booking_hero.avif"
          alt=""
          fill
          preload
          sizes="100vw"
          className="animate-slowzoom object-cover object-[center_25%]"
        />
      </Parallax>

      <div className="absolute inset-0 bg-linear-to-br from-forest/90 via-forest/65 to-terracotta/35" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-forest/60 to-transparent" />

      <PalmFrond className="pointer-events-none absolute -left-16 -bottom-20 h-[420px] origin-bottom rotate-[20deg] text-gold/20 animate-sway" />
      <PalmFrond className="pointer-events-none absolute -right-16 -top-16 h-[380px] origin-bottom rotate-[200deg] text-gold/15 animate-sway [animation-delay:-4s]" />
      <Leaf className="pointer-events-none absolute right-[20%] bottom-24 h-14 text-gold/30 animate-float" />
      <GoldDust />

      <div className="relative z-10 max-w-3xl px-6 text-center text-cream">
        <Reveal variant="none">
          <div className="flex items-center justify-center gap-4 text-xs uppercase tracking-[0.4em] text-gold">
            <span className="grow-line h-px w-10 origin-right bg-gold" />
            Онлайн запись
            <span className="grow-line h-px w-10 bg-gold" />
          </div>
          <h1 className="mt-6 font-display text-[clamp(2.6rem,7vw,5rem)] font-light leading-[1] tracking-[-0.01em]">
            <SplitWords text="Забронировать" />
            <em className="italic text-gold">
              <SplitWords text="сеанс" offset={1} />
            </em>
          </h1>
        </Reveal>
        <Reveal variant="blur" delay={400}>
          <p className="mx-auto mt-5 max-w-xl font-light leading-relaxed text-cream/75">
            Выберите массажиста, программу, дату и время
          </p>
        </Reveal>
      </div>
    </section>
  );
}
