const benefits: string[] = [
  "Натуральные масла",
  "Ароматерапия",
  "Мастера высшего класса",
  "Индивидуальный подход",
];

export default function Strip() {
  return (
    <div className="bg-[#2d4a2f] py-[18px] px-[5vw] flex justify-center gap-[6vw] flex-wrap">
      {benefits.map((t: string) => (
        <span
          key={t}
          className="text-[#f5ede0]/70 text-[0.72rem] tracking-[0.25em] uppercase flex items-center gap-2.5 before:content-['✦'] before:text-[#c9a84c] before:text-[0.5rem]"
        >
          {t}
        </span>
      ))}
    </div>
  );
}
