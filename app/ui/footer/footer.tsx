import Link from "next/link";
import { ArrowUpIcon } from "@heroicons/react/24/outline";
import { CURRENT_YEAR } from "@/app/constants/current_year";
import { NAV_LINKS } from "@/app/constants/navigation";
import Reveal from "@/app/ui/motion/reveal";
import { Leaf } from "@/app/ui/motion/decor";

const SERVICES = [
  "Балийский массаж",
  "Тайский массаж",
  "Релакс массаж",
  "Скорая массажная помощь",
  "Спортивный массаж",
];

const CONTACTS = [
  { label: "Адрес", value: "Весь мир" },
  { label: "Телефон", value: "" },
  { label: "Email", value: "nikovoronkovwork@gmail.com" },
  { label: "Часы работы", value: "9:00-23:00" },
];

const WORDMARK = "Niko·Massage".split("");

export default function Footer() {
  return (
    <footer
      id="contacts"
      className="grain relative overflow-hidden bg-forest-deep px-5 pt-24 text-cream/60 md:px-8"
    >
      <Leaf className="pointer-events-none absolute right-[8%] top-16 h-24 rotate-12 text-gold/15 animate-float" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-14 border-b border-gold/15 pb-16 md:grid-cols-2 lg:grid-cols-12">
          <Reveal variant="up" className="lg:col-span-4">
            <p className="font-display text-4xl font-light leading-tight text-cream">
              Время <em className="italic text-gold">для себя</em> начинается
              здесь
            </p>
            <p className="mt-5 max-w-xs text-sm font-light leading-[1.8]">
              Массажный салон с лучшими массажными практиками со всего мира.
              Сертифицированный специалист с многолетним опытом.
            </p>
            <Link
              href="/bookings/create"
              className="shine mt-8 inline-flex rounded-full border border-gold/60 px-7 py-3 text-xs font-medium uppercase tracking-[0.2em] text-gold transition-all duration-500 hover:bg-gold hover:text-forest"
            >
              Записаться
            </Link>
          </Reveal>

          <Reveal
            variant="up"
            delay={100}
            className="lg:col-span-2 lg:col-start-6"
          >
            <h4 className="mb-6 text-[0.7rem] font-medium uppercase tracking-[0.3em] text-gold">
              Навигация
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal variant="up" delay={200} className="lg:col-span-3">
            <h4 className="mb-6 text-[0.7rem] font-medium uppercase tracking-[0.3em] text-gold">
              Услуги
            </h4>
            <ul className="space-y-3">
              {SERVICES.map((service) => (
                <li key={service}>
                  <FooterLink href="/#rituals">{service}</FooterLink>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal variant="up" delay={300} className="lg:col-span-2">
            <h4 className="mb-6 text-[0.7rem] font-medium uppercase tracking-[0.3em] text-gold">
              Контакты
            </h4>
            <dl className="space-y-4 text-sm">
              {CONTACTS.map((contact) => (
                <div key={contact.label}>
                  <dt className="text-[0.65rem] uppercase tracking-[0.25em] text-cream/35">
                    {contact.label}
                  </dt>
                  <dd className="mt-1 font-light text-cream/75">
                    {contact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* Giant wordmark, letters rise one by one */}
        <Reveal variant="none" threshold={0.4} className="py-10">
          <p
            aria-label="Niko Massage"
            className="flex select-none justify-center overflow-hidden font-display text-[15.5vw] font-light leading-[0.9] text-cream/90 lg:text-[13.5rem]"
          >
            {WORDMARK.map((letter, i) => (
              <span key={i} aria-hidden="true" className="split-word">
                <span
                  className={letter === "·" ? "text-gold" : undefined}
                  style={{ "--i": i } as React.CSSProperties}
                >
                  {letter}
                </span>
              </span>
            ))}
          </p>
        </Reveal>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gold/15 py-8 text-xs tracking-[0.1em] text-cream/40">
          <span>© {CURRENT_YEAR} Niko·Massage. Все права защищены.</span>
          <Link
            href="#top"
            className="group inline-flex items-center gap-3 uppercase tracking-[0.25em] transition-colors hover:text-gold"
          >
            Наверх
            <span className="flex size-9 items-center justify-center rounded-full border border-cream/20 transition-all duration-500 group-hover:-translate-y-1 group-hover:border-gold">
              <ArrowUpIcon className="size-4" />
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group relative inline-block text-sm font-light text-cream/60 transition-colors duration-300 hover:text-cream"
    >
      {children}
      <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-gold transition-transform duration-500 ease-out-expo group-hover:origin-left group-hover:scale-x-100" />
    </Link>
  );
}
