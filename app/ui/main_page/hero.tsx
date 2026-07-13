import { useRef } from "react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-screen min-h-170 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/main_hero.jpeg')] bg-cover bg-center animate-slowzoom" />
      <div className="absolute inset-0 bg-linear-to-br from-[#1a2e1e]/70 via-[#1a2e1e]/45 to-[#b5633a]/25" />

      <div className="relative z-10 text-center text-[#f5ede0] px-6 max-w-195 animate-fadeUp">
        <div className="text-[0.72rem] tracking-[0.35em] uppercase text-[#c9a84c] mb-6 font-normal flex items-center justify-center gap-3.5 before:content-[''] before:block before:w-10 before:h-px before:bg-[#c9a84c] before:opacity-60 after:content-[''] after:block after:w-10 after:h-px after:bg-[#c9a84c] after:opacity-60">
          Массажный салон · Лучшие массажные программы
        </div>
        <h1 className="font-['Cormorant_Garamond',serif] text-[clamp(3rem,8vw,6.5rem)] font-light leading-[1.1] tracking-[-0.01em] mb-7">
          Твоё тело
          <br /> <em className="italic text-[#c9a84c]">заслуживает</em>{" "}
          расслабиться
        </h1>
        <p className="text-[1.05rem] font-light opacity-80 leading-[1.7] max-w-120 mx-auto mb-11">
          Лучшие массажные практики, собранные со всего мира. Ваше тело
          заслуживает настоящего отдыха.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button className="px-9.5 py-3.75 text-[0.78rem] tracking-[0.18em] uppercase font-medium bg-[#b5633a] text-[#f5ede0] border-none cursor-pointer transition-all duration-300 hover:bg-[#c97050] hover:-translate-y-0.5">
            <Link href="/bookings/create">Записаться на сеанс</Link>
          </button>
          {/*<button className="px-9.5 py-3.5 text-[0.78rem] tracking-[0.18em] uppercase font-normal bg-transparent text-[#f5ede0] border border-[#f5ede0]/50 cursor-pointer transition-all duration-300 hover:border-[#f5ede0]">*/}
          {/*  Наши ритуалы*/}
          {/*</button>*/}
        </div>
      </div>
    </section>
  );
}
