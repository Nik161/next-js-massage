export default function HeroBooking() {
  return (
    <section className="relative h-[45vh] min-h-100 flex items-center justify-center overflow-hidden">
      {/* Фоновое изображение */}
      <div
        className="absolute inset-0 bg-[url('/images/booking_hero.avif')] bg-cover bg-center animate-slowzoom"
        style={{ backgroundPosition: "center 30%" }}
      />

      {/* Градиент поверх изображения */}
      <div className="absolute inset-0 bg-linear-to-br from-[#1a2e1e]/80 via-[#1a2e1e]/60 to-[#b5633a]/30" />

      {/* Контент hero */}
      <div className="relative z-10 text-center text-[#f5ede0] px-6 max-w-195 animate-fadeUp">
        <div className="text-[0.68rem] tracking-[0.35em] uppercase text-[#c9a84c] mb-5 font-normal flex items-center justify-center gap-3.5 before:content-[''] before:block before:w-10 before:h-px before:bg-[#c9a84c] before:opacity-60 after:content-[''] after:block after:w-10 after:h-px after:bg-[#c9a84c] after:opacity-60">
          Онлайн запись
        </div>
        <h1 className="font-['Cormorant_Garamond',serif] text-[clamp(2.5rem,6vw,5rem)] font-light leading-[1.1] tracking-[-0.01em] mb-4">
          Забронировать <em className="italic text-[#c9a84c]">сеанс</em>
        </h1>
        <p className="text-[0.95rem] font-light opacity-80 leading-relaxed max-w-2xl mx-auto">
          Выберите программу, дату и время — мы подтвердим запись в течение 15
          минут
        </p>
      </div>
    </section>
  );
}
