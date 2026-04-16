import MassageName from "@/app/ui/massage_name";
import { CURRENT_YEAR } from "@/app/constants/current_year";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1a2e1b] text-[#f5ede0]/60 pt-20 pb-10 px-[5vw]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-15 pb-15 border-b border-[#c9a84c]/25 mb-10">
        <div>
          <h3 className="font-['Cormorant_Garamond',serif] text-[1.8rem] font-semibold text-[#f5ede0] mb-4">
            <Link href="/">
              <MassageName />
            </Link>
          </h3>
          <p className="text-[0.88rem] leading-[1.8] font-light max-w-70">
            Массажный салон с лучшими массажными практиками со всего мира.
            Сертифицированный специалист с многолетним опытом
          </p>
        </div>

        <div>
          <h4 className="text-[0.7rem] tracking-[0.3em] uppercase text-[#c9a84c] mb-5.5 font-medium">
            Услуги
          </h4>
          <ul className="list-none flex flex-col gap-3">
            {[
              "Балийский массаж",
              "Тайский массаж",
              "Релакс массаж",
              "Скорая массажная помощь",
              "Спортивный массаж",
            ].map((l) => (
              <li key={l}>
                <a
                  href="#"
                  className="text-[0.88rem] text-[#f5ede0]/60 no-underline transition-colors duration-300 font-light hover:text-[#f5ede0]"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[0.7rem] tracking-[0.3em] uppercase text-[#c9a84c] mb-5.5 font-medium">
            Информация
          </h4>
          <ul className="list-none flex flex-col gap-3">
            {["О нас", "Галерея", "Цены", "Блог"].map((l) => (
              <li key={l}>
                <a
                  href="#"
                  className="text-[0.88rem] text-[#f5ede0]/60 no-underline transition-colors duration-300 font-light hover:text-[#f5ede0]"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[0.7rem] tracking-[0.3em] uppercase text-[#c9a84c] mb-5.5 font-medium">
            Контакты
          </h4>
          <div className="text-[0.88rem] font-light mb-2.5 flex items-start gap-2.5 leading-[1.6]">
            <span className="text-[#c9a84c] text-[0.9rem] shrink-0 mt-0.5">
              📍
            </span>
            <span>regions</span>
          </div>
          <div className="text-[0.88rem] font-light mb-2.5 flex items-start gap-2.5 leading-[1.6]">
            <span className="text-[#c9a84c] text-[0.9rem] shrink-0 mt-0.5">
              📞
            </span>
            <span>phone number</span>
          </div>
          <div className="text-[0.88rem] font-light mb-2.5 flex items-start gap-2.5 leading-[1.6]">
            <span className="text-[#c9a84c] text-[0.9rem] shrink-0 mt-0.5">
              ✉️
            </span>
            <span>email</span>
          </div>
          <div className="text-[0.88rem] font-light mb-2.5 flex items-start gap-2.5 leading-[1.6]">
            <span className="text-[#c9a84c] text-[0.9rem] shrink-0 mt-0.5">
              🕐
            </span>
            <span>working hours</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center flex-wrap gap-3 text-[0.75rem] tracking-[0.08em] opacity-40">
        <div className="flex">
          © {`${CURRENT_YEAR}`} <span className="text-[#c9a84c]">·</span>
          <MassageName />. All rights reserved.
        </div>
        {/*<div className="flex gap-5">*/}
        {/*  <a href="#" className="text-[#f5ede0]/50 no-underline text-[0.8rem] tracking-[0.15em] transition-colors duration-300 hover:text-[#c9a84c]">Instagram</a>*/}
        {/*  <a href="#" className="text-[#f5ede0]/50 no-underline text-[0.8rem] tracking-[0.15em] transition-colors duration-300 hover:text-[#c9a84c]">Telegram</a>*/}
        {/*  <a href="#" className="text-[#f5ede0]/50 no-underline text-[0.8rem] tracking-[0.15em] transition-colors duration-300 hover:text-[#c9a84c]">VK</a>*/}
        {/*</div>*/}
      </div>
    </footer>
  );
}
