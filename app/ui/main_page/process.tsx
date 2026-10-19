import Link from "next/link";
import {
  CalendarDaysIcon,
  SparklesIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Reveal from "@/app/ui/motion/reveal";
import Magnetic from "@/app/ui/motion/magnetic";
import SectionHeading from "@/app/ui/main_page/section_heading";

// Mirrors the three steps of the booking wizard
const STEPS = [
  {
    title: "Выберите мастера",
    text: "Познакомьтесь со специалистами и выберите того, кто вам ближе.",
    Icon: UserIcon,
  },
  {
    title: "Подберите ритуал",
    text: "Технику массажа и продолжительность — 30, 60 или 90 минут.",
    Icon: SparklesIcon,
  },
  {
    title: "Назначьте время",
    text: "Мы покажем только свободные окна — останется прийти и расслабиться.",
    Icon: CalendarDaysIcon,
  },
];

export default function Process() {
  return (
    <section className="relative overflow-hidden bg-clay px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          align="center"
          eyebrow="Как это работает"
          title="Три шага до"
          accent="полного покоя"
        />

        <Reveal variant="none" className="relative mt-20">
          {/* Connecting line drawn on reveal (desktop) */}
          <svg
            className="absolute left-[16%] right-[16%] top-10 hidden h-4 w-[68%] md:block"
            viewBox="0 0 100 4"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M0 2 Q 25 0, 50 2 T 100 2"
              pathLength={1}
              className="draw-path stroke-terracotta/50"
              strokeWidth="0.3"
              strokeDasharray="1"
            />
          </svg>

          <ol className="relative grid gap-14 md:grid-cols-3 md:gap-8">
            {STEPS.map(({ title, text, Icon }, i) => (
              <Reveal
                as="li"
                key={title}
                variant="up"
                delay={200 + i * 180}
                className="group flex flex-col items-center text-center"
              >
                <div className="relative">
                  <span className="absolute inset-0 rounded-full bg-terracotta/20 transition-transform duration-700 ease-out-expo group-hover:scale-150 group-hover:opacity-0" />
                  <span className="relative flex size-20 items-center justify-center rounded-full bg-forest text-gold shadow-lift transition-transform duration-700 ease-out-expo group-hover:-translate-y-2">
                    <Icon className="size-8" />
                  </span>
                  <span className="absolute -right-2 -top-2 flex size-8 items-center justify-center rounded-full bg-cream font-display text-sm text-terracotta shadow-soft">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-8 font-display text-3xl font-light text-forest">
                  {title}
                </h3>
                <p className="mt-3 max-w-xs font-light leading-relaxed text-earth">
                  {text}
                </p>
              </Reveal>
            ))}
          </ol>
        </Reveal>

        <Reveal variant="up" delay={500} className="mt-16 flex justify-center">
          <Magnetic>
            <Link
              href="/bookings/create"
              className="shine inline-flex rounded-full bg-forest px-10 py-4 text-[0.8rem] font-medium uppercase tracking-[0.2em] text-cream shadow-lift transition-colors duration-500 hover:bg-forest-soft"
            >
              Начать запись
            </Link>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
