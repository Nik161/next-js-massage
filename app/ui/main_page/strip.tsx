import { Marquee } from "@/app/ui/motion/decor";

const BENEFITS = [
  "Натуральные масла",
  "Ароматерапия",
  "Мастера высшего класса",
  "Индивидуальный подход",
];

const RITUALS = [
  "Балийский массаж",
  "Горячие камни",
  "Ритуал джунглей",
  "Тайский массаж",
];

// Two marquee rows moving in opposite directions
export default function Strip() {
  return (
    <section aria-label="Преимущества" className="overflow-hidden">
      <div className="bg-forest-soft py-4">
        <Marquee
          items={BENEFITS}
          itemClassName="text-[0.72rem] uppercase tracking-[0.3em] text-cream/75"
        />
      </div>
      <div className="-rotate-1 scale-[1.02] border-y border-gold/30 bg-cream py-6">
        <Marquee
          reverse
          items={RITUALS}
          itemClassName="font-display text-4xl font-light italic text-forest md:text-6xl"
        />
      </div>
    </section>
  );
}
