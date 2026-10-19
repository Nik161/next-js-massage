import Image from "next/image";
import Link from "next/link";
import Reveal from "@/app/ui/motion/reveal";
import SplitWords from "@/app/ui/motion/split_words";
import Parallax from "@/app/ui/motion/parallax";
import Magnetic from "@/app/ui/motion/magnetic";
import { GoldDust, Leaf, PalmFrond } from "@/app/ui/motion/decor";

export default function Banner() {
  return (
    <section className="grain relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-forest px-5 text-center">
      <Parallax speed={-0.3} className="absolute -inset-y-[20%] inset-x-0">
        <Image
          src="/images/open_bath.jpeg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover brightness-[0.4] saturate-[0.8]"
        />
      </Parallax>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgb(15_28_16/0.85)_75%)]" />

      <PalmFrond className="pointer-events-none absolute -left-16 bottom-0 h-[480px] origin-bottom rotate-12 text-gold/20 animate-sway" />
      <PalmFrond className="pointer-events-none absolute -right-16 top-0 h-[420px] origin-bottom rotate-[200deg] text-gold/15 animate-sway [animation-delay:-4s]" />
      <Leaf className="pointer-events-none absolute right-[22%] top-[20%] h-16 text-gold/30 animate-float" />
      <GoldDust />

      <div className="relative z-10 max-w-4xl">
        <Reveal variant="none">
          <h2 className="font-display text-[clamp(3rem,8vw,6.5rem)] font-light leading-[1] text-cream">
            <SplitWords text="Подарите себе" />
            <br />
            <em className="italic text-gold">
              <SplitWords text="этот момент" offset={2} />
            </em>
          </h2>
        </Reveal>
        <Reveal variant="blur" delay={400}>
          <p className="mx-auto mt-8 max-w-md font-light leading-relaxed text-cream/70">
            Первый визит — это только начало вашего пути к гармонии
          </p>
        </Reveal>
        <Reveal variant="up" delay={600} className="mt-12">
          <Magnetic strength={0.4}>
            <Link
              href="/bookings/create"
              className="shine group relative inline-flex size-44 items-center justify-center rounded-full bg-gold text-[0.78rem] font-medium uppercase tracking-[0.2em] text-forest shadow-[0_0_60px_rgb(201_168_76/0.35)] transition-transform duration-700 ease-out-expo hover:scale-105"
            >
              <span className="absolute inset-0 animate-ping rounded-full border border-gold/50 [animation-duration:2.5s]" />
              Записаться
              <br />
              сейчас
            </Link>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
