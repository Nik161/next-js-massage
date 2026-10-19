import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Reveal from "@/app/ui/motion/reveal";
import Parallax from "@/app/ui/motion/parallax";
import { Leaf, RotatingBadge } from "@/app/ui/motion/decor";
import SectionHeading from "@/app/ui/main_page/section_heading";

const FEATURES = [
  "Натуральные масла",
  "Ароматерапия",
  "Мастера высшего класса",
  "Индивидуальный подход",
];

export default function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-cream px-5 py-28 md:px-8 md:py-40"
    >
      {/* Giant outline word drifting with the scroll */}
      <Parallax
        speed={0.4}
        className="pointer-events-none absolute -left-10 top-24 select-none"
      >
        <span className="text-outline font-display text-[22vw] font-light leading-none text-clay">
          Bali
        </span>
      </Parallax>

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-12 lg:gap-10">
        {/* Images */}
        <div className="relative mx-auto mb-10 w-full max-w-md lg:col-span-5 lg:mb-0 lg:max-w-none">
          <Reveal
            variant="wipe"
            className="relative aspect-[3/4] overflow-hidden rounded-t-full shadow-lift"
          >
            <Parallax
              speed={0.12}
              className="absolute -inset-y-[10%] inset-x-0"
            >
              <Image
                src="/images/massage_back.jpeg"
                alt="Мастер делает массаж спины"
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
            </Parallax>
            <div className="absolute inset-0 bg-linear-to-t from-forest/40 to-transparent" />
          </Reveal>

          <Parallax
            speed={-0.18}
            minWidth={1024}
            className="absolute -bottom-10 -right-4 w-[46%] sm:-right-10"
          >
            <Reveal
              variant="scale"
              delay={400}
              className="aspect-square overflow-hidden rounded-full border-[6px] border-cream shadow-lift"
            >
              <Image
                src="/images/towel_oil.jpeg"
                alt="Полотенце, масло и цветы"
                width={400}
                height={400}
                className="size-full object-cover transition-transform duration-1000 hover:scale-110"
              />
            </Reveal>
          </Parallax>

          <Reveal
            variant="scale"
            delay={700}
            className="absolute -left-6 top-10 text-forest"
          >
            <RotatingBadge text="Подлинные ритуалы · Бали · ">
              <Leaf className="h-10 text-terracotta" />
            </RotatingBadge>
          </Reveal>
        </div>

        {/* Text */}
        <div className="lg:col-span-6 lg:col-start-7">
          <SectionHeading
            eyebrow="О нас"
            title="Искусство"
            accent="исцеления,"
            after="рождённое на Бали"
          />

          <Reveal variant="up" delay={300}>
            <p className="mt-8 text-lg font-light leading-[1.85] text-earth">
              Мы создали пространство, где древние балийские традиции
              встречаются с современным пониманием тела. Каждый сеанс — это
              путешествие, а не просто процедура.
            </p>
          </Reveal>
          <Reveal variant="up" delay={420}>
            <p className="mt-5 text-lg font-light leading-[1.85] text-earth">
              Наши мастера прошли обучение непосредственно на острове Бали,
              сохраняя подлинность каждого прикосновения, каждого аромата и
              каждого ритуала.
            </p>
          </Reveal>

          <ul className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-clay bg-clay sm:grid-cols-2">
            {FEATURES.map((feature, i) => (
              <Reveal
                as="li"
                key={feature}
                variant="fade"
                delay={500 + i * 100}
                className="group flex items-center gap-4 bg-cream p-5 transition-colors duration-500 hover:bg-white"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-forest text-sm text-gold transition-transform duration-700 group-hover:rotate-[360deg]">
                  ✦
                </span>
                <span className="text-forest">{feature}</span>
              </Reveal>
            ))}
          </ul>

          <Reveal variant="up" delay={900}>
            <Link
              href="#masters"
              className="group mt-10 inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-forest"
            >
              Познакомиться с мастерами
              <span className="flex size-10 items-center justify-center rounded-full border border-forest/20 transition-all duration-500 group-hover:translate-x-1 group-hover:border-terracotta group-hover:bg-terracotta group-hover:text-cream">
                <ArrowRightIcon className="size-4" />
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
