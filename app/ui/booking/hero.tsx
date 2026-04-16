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
      </div>
    </section>
  );
}
