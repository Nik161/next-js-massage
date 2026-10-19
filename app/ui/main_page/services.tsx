import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import Reveal from "@/app/ui/motion/reveal";
import TiltCard from "@/app/ui/motion/tilt_card";
import { PalmFrond } from "@/app/ui/motion/decor";
import SectionHeading from "@/app/ui/main_page/section_heading";

const SERVICES = [
  {
    title: "Балийский массаж",
    desc: "Древняя техника, сочетающая акупрессуру, растяжку и ароматерапию. Полное растворение в покое.",
    duration: "60 мин",
    image: "/images/massage_back.jpeg",
  },
  {
    title: "Горячие камни",
    desc: "Вулканические камни острова Бали прогревают глубокие мышцы, снимая накопленное напряжение.",
    duration: "60 мин",
    image: "/images/main_hero.jpeg",
  },
  {
    title: "Ритуал джунглей",
    desc: "Полное погружение: скраб из трав, ванна с лепестками и масляный массаж при свечах.",
    duration: "120 мин",
    image: "/images/open_bath.jpeg",
  },
  {
    title: "Тайский массаж",
    desc: "Работа с энергетическими меридианами тела. Гибкость, лёгкость и ясность в каждом движении.",
    duration: "60 мин",
    image: "/images/towel_oil.jpeg",
  },
];

export default function Services() {
  return (
    <section
      id="rituals"
      className="grain relative overflow-hidden bg-forest px-5 py-28 md:px-8 md:py-40"
    >
      <div className="pointer-events-none absolute -right-40 -top-40 size-[600px] rounded-full bg-forest-soft/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-20 size-[500px] rounded-full bg-terracotta/10 blur-3xl" />
      <PalmFrond className="pointer-events-none absolute -right-10 bottom-0 h-[520px] origin-bottom text-gold/10 animate-sway" />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            tone="dark"
            eyebrow="Наши услуги"
            title="Ритуалы для"
            accent="души"
            after="и тела"
          />
          <Reveal variant="up" delay={300}>
            <p className="max-w-sm font-light leading-[1.8] text-cream/60">
              Каждая программа тщательно составлена, чтобы восстановить баланс и
              наполнить энергией.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service, i) => (
            <Reveal key={service.title} variant="up" delay={i * 120}>
              <TiltCard className="h-full rounded-3xl">
                <Link
                  href="/bookings/create"
                  className="group relative flex h-full min-h-[340px] flex-col lg:min-h-[440px] overflow-hidden rounded-3xl border border-gold/15 bg-white/[0.04] p-8 transition-colors duration-700 hover:border-gold/40"
                >
                  {/* Photo appears on hover */}
                  <Image
                    src={service.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="scale-110 object-cover opacity-0 transition-all duration-1000 ease-out-expo group-hover:scale-100 group-hover:opacity-40"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-forest via-forest/70 to-forest/20 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                  <div className="relative flex items-start justify-between">
                    <span className="text-outline font-display text-6xl font-light text-gold/70 transition-colors duration-700 group-hover:text-gold">
                      0{i + 1}
                    </span>
                    <span className="flex size-11 items-center justify-center rounded-full border border-gold/30 text-gold transition-all duration-700 group-hover:rotate-45 group-hover:border-gold group-hover:bg-gold group-hover:text-forest">
                      <ArrowUpRightIcon className="size-5" />
                    </span>
                  </div>

                  <div className="relative mt-auto">
                    <h3 className="font-display text-3xl font-light text-cream">
                      {service.title}
                    </h3>
                    <p className="mt-4 text-[0.92rem] font-light leading-[1.8] text-cream/55 transition-colors duration-700 group-hover:text-cream/85">
                      {service.desc}
                    </p>
                    <div className="mt-6 flex items-center gap-3 text-[0.72rem] uppercase tracking-[0.25em] text-gold">
                      <span className="h-px w-6 bg-gold transition-all duration-700 group-hover:w-12" />
                      {service.duration}
                    </div>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-linear-to-r from-terracotta to-gold transition-transform duration-700 ease-out-expo group-hover:scale-x-100" />
                </Link>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
