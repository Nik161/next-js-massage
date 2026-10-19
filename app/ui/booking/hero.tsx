export default function HeroBooking() {
  return (
    <section className="relative flex min-h-80 items-center justify-center overflow-hidden pb-12 pt-16 md:min-h-96">
      {/* Background image */}
      <div
        className="absolute inset-0 animate-slowzoom bg-[url('/images/booking_hero.avif')] bg-cover bg-center"
        style={{ backgroundPosition: "center 25%" }}
      />

      {/* Gradient over the image */}
      <div className="absolute inset-0 bg-linear-to-br from-forest/85 via-forest/60 to-terracotta/30" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-sand/20 to-transparent" />

      <div className="relative z-10 max-w-195 animate-fadeUp px-6 text-center text-cream">
        <div className="mb-5 flex items-center justify-center gap-3.5 text-xs font-normal uppercase tracking-[0.35em] text-gold before:block before:h-px before:w-10 before:bg-gold before:opacity-60 after:block after:h-px after:w-10 after:bg-gold after:opacity-60">
          Онлайн запись
        </div>
        <h1 className="mb-4 font-display text-[clamp(2.4rem,7vw,4rem)] font-light leading-[1.05] tracking-[-0.01em]">
          Забронировать <em className="italic text-gold">сеанс</em>
        </h1>
        <p className="mx-auto max-w-2xl font-light leading-relaxed opacity-80">
          Выберите массажиста, программу, дату и время
        </p>
      </div>
    </section>
  );
}
