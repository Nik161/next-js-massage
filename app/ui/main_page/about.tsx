import Image from "next/image";

export default function About() {
  return (
    <section className="grid md:grid-cols-2 min-h-150">
      <div className="relative overflow-hidden min-h-125 group">
        <Image
          src="/images/massage_back.jpeg"
          alt="Интерьер спа"
          width={800}
          height={533}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-[#e8d5bc] md:to-60%" />
      </div>

      <div className="bg-[#e8d5bc] py-20 px-[7vw] md:px-[5vw] flex flex-col justify-center">
        <div className="text-[0.7rem] tracking-[0.3em] uppercase text-[#b5633a] mb-5 font-medium">
          О нас
        </div>
        <h2 className="font-['Cormorant_Garamond',serif] text-[clamp(2rem,4vw,3.2rem)] font-light leading-[1.2] mb-7 text-[#1a2e1b]">
          Искусство <em className="italic text-[#b5633a]">исцеления</em>,
          <br />
          рождённое на Бали
        </h2>
        <p className="text-base leading-[1.85] text-[#7a6552] font-light mb-4.5">
          Мы создали пространство, где древние балийские традиции встречаются с
          современным пониманием тела. Каждый сеанс — это путешествие, а не
          просто процедура.
        </p>
        <p className="text-base leading-[1.85] text-[#7a6552] font-light mb-4.5">
          Наши мастера прошли обучение непосредственно на острове Бали, сохраняя
          подлинность каждого прикосновения, каждого аромата и каждого ритуала.
        </p>
        {/*<div className="flex gap-10 mt-9 flex-wrap">*/}
        {/*  <div className="flex flex-col gap-1">*/}
        {/*    <span className="font-['Cormorant_Garamond',serif] text-[2.6rem] font-semibold text-[#2d4a2f] leading-none">*/}
        {/*      8*/}
        {/*    </span>*/}
        {/*    <span className="text-[0.72rem] tracking-[0.18em] uppercase text-[#7a6552]">*/}
        {/*      Лет опыта*/}
        {/*    </span>*/}
        {/*  </div>*/}
        {/*  <div className="flex flex-col gap-1">*/}
        {/*    <span className="font-['Cormorant_Garamond',serif] text-[2.6rem] font-semibold text-[#2d4a2f] leading-none">*/}
        {/*      1*/}
        {/*    </span>*/}
        {/*    <span className="text-[0.72rem] tracking-[0.18em] uppercase text-[#7a6552]">*/}
        {/*      Мастеров Бали*/}
        {/*    </span>*/}
        {/*  </div>*/}
        {/*  <div className="flex flex-col gap-1">*/}
        {/*    <span className="font-['Cormorant_Garamond',serif] text-[2.6rem] font-semibold text-[#2d4a2f] leading-none">*/}
        {/*      4k+*/}
        {/*    </span>*/}
        {/*    <span className="text-[0.72rem] tracking-[0.18em] uppercase text-[#7a6552]">*/}
        {/*      Довольных гостей*/}
        {/*    </span>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    </section>
  );
}
