const SERVICES = [
  {
    title: "Балийский массаж",
    desc: "Древняя техника, сочетающая акупрессуру, растяжку и ароматерапию. Полное растворение в покое.",
    duration: "60 мин",
    icon: "🌺",
  },
  {
    title: "Горячие камни",
    desc: "Вулканические камни острова Бали прогревают глубокие мышцы, снимая накопленное напряжение.",
    duration: "60 мин",
    icon: "🪨",
  },
  {
    title: "Ритуал джунглей",
    desc: "Полное погружение: скраб из трав, ванна с лепестками и масляный массаж при свечах.",
    duration: "120 мин",
    icon: "🌿",
  },
  {
    title: "Тайский массаж",
    desc: "Работа с энергетическими меридианами тела. Гибкость, лёгкость и ясность в каждом движении.",
    duration: "60 мин",
    icon: "✨",
  },
];

export default function Services() {
  return (
    <section className="bg-[#1a2e1b] py-[100px] px-[5vw] relative overflow-hidden">
      <div className="absolute -top-[120px] -right-[120px] w-[500px] h-[500px] bg-radial-gradient from-[#2d4a2f]/60 to-transparent pointer-events-none rounded-full" />

      <div className="text-center mb-[70px]">
        <div className="text-[0.7rem] tracking-[0.3em] uppercase text-[#c9a84c] mb-5 font-medium">
          Наши услуги
        </div>
        <h2 className="font-['Cormorant_Garamond',serif] text-[clamp(2.2rem,5vw,4rem)] font-light text-[#f5ede0] leading-[1.2]">
          Ритуалы для <em className="italic text-[#c9a84c] not-italic">души</em>{" "}
          и тела
        </h2>
        <p className="mt-[18px] text-[0.95rem] font-light text-[#f5ede0]/55 max-w-[500px] mx-auto leading-[1.8]">
          Каждая программа тщательно составлена, чтобы восстановить баланс и
          наполнить энергией
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px max-w-[1200px] mx-auto">
        {SERVICES.map((s) => (
          <div
            key={s.title}
            className="px-9 py-[50px] bg-white/5 border border-[#c9a84c]/10 transition-all duration-300 hover:bg-white/10 hover:border-[#c9a84c]/25 hover:-translate-y-1 relative overflow-hidden cursor-default group"
          >
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#b5633a] to-[#c9a84c] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            <div className="text-3xl mb-6">{s.icon}</div>
            <h3 className="font-['Cormorant_Garamond',serif] text-2xl font-normal text-[#f5ede0] mb-3.5">
              {s.title}
            </h3>
            <p className="text-[0.9rem] leading-[1.8] text-[#f5ede0]/55 font-light mb-6">
              {s.desc}
            </p>
            <div className="text-[0.7rem] tracking-[0.2em] uppercase text-[#c9a84c] font-medium flex items-center gap-2 before:content-['◦']">
              {s.duration}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
