import Link from "next/link";

export default function Banner() {
  return (
    <section className="relative min-h-120 flex items-center justify-center text-center overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/towel_oil.jpeg')] bg-cover bg-center brightness-[0.35] saturate-[0.8]" />
      <div className="relative z-10 px-6">
        <h2 className="font-['Cormorant_Garamond',serif] text-[clamp(2.5rem,6vw,5rem)] font-light text-[#f5ede0] mb-6 leading-[1.15]">
          Подарите себе
          <br />
          <em className="italic text-[#c9a84c]">этот момент</em>
        </h2>
        <p className="text-[#f5ede0]/65 mb-10 font-light text-base">
          Первый визит — это только начало вашего пути к гармонии
        </p>
        <button
          className="px-9.5 py-3.75 text-[0.78rem] tracking-[0.18em]
         uppercase font-medium bg-[#b5633a] text-[#f5ede0] border-none
          cursor-pointer transition-all duration-300 hover:bg-[#c97050] hover:-translate-y-0.5"
        >
          <Link href="/app/bookings">Записаться прямо сейчас</Link>
        </button>
      </div>
    </section>
  );
}
