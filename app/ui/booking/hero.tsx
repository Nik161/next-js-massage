import { PowerIcon } from "@heroicons/react/24/outline";
import { signOut } from "@/auth";

export default function HeroBooking() {
  return (
    <section className="relative min-h-80 flex items-center justify-center overflow-hidden">
      {/* Фоновое изображение */}
      <div
        className="absolute inset-0 bg-[url('/images/booking_hero.avif')] bg-cover bg-center animate-slowzoom"
        style={{ backgroundPosition: "center 25%" }}
      />

      {/* Градиент поверх изображения */}
      <div className="absolute inset-0 bg-linear-to-br from-[#1a2e1e]/80 via-[#1a2e1e]/60 to-[#b5633a]/30" />

      {/* Контент hero */}
      <div className="relative z-10 text-center text-[#f5ede0] px-6 max-w-195 animate-fadeUp">
        <div className="text-[1rem] tracking-[0.35em] uppercase text-[#c9a84c] mb-5 font-normal flex items-center justify-center gap-3.5 before:content-[''] before:block before:w-10 before:h-px before:bg-[#c9a84c] before:opacity-60 after:content-[''] after:block after:w-10 after:h-px after:bg-[#c9a84c] after:opacity-60">
          Онлайн запись
        </div>
        <h1 className="text-[3rem] font-light leading-[1.1] tracking-[-0.01em] mb-4">
          Забронировать <em className="italic text-[#c9a84c]">сеанс</em>
        </h1>
        <p className="text-[1rem] font-light opacity-80 leading-relaxed max-w-2xl mx-auto">
          Выберите программу, дату, время и способ оплаты
        </p>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
          className="mt-8"
        >
          <button
            type="submit"
            className="group relative inline-flex items-center gap-3 px-6 py-3
                       text-[#f5ede0] border border-[#c9a84c]/30 rounded-full
                       bg-[#1a2e1e]/40 backdrop-blur-sm
                       hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/60
                       transition-all duration-300 ease-out
                       hover:shadow-[0_0_20px_rgba(201,168,76,0.15)]"
          >
            <PowerIcon
              className="w-5 h-5 text-[#c9a84c]/70 group-hover:text-[#c9a84c]
                                    transition-colors duration-300"
            />
            <span
              className="text-sm tracking-wider uppercase font-light
                             group-hover:text-[#c9a84c] transition-colors duration-300"
            >
              Выйти
            </span>
          </button>
        </form>
      </div>
    </section>
  );
}
