import Image from "next/image";

const GALLERY_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80",
    label: "Открытый павильон",
  },
  {
    url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80",
    label: "Тропическая атмосфера",
  },
  {
    url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    label: "Ритуалы Бали",
  },
  {
    url: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&q=80",
    label: "Камни и масла",
  },
  {
    url: "https://images.unsplash.com/photo-1596178060810-72f53ce9a65c?w=800&q=80",
    label: "Лепестки и свет",
  },
  {
    url: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&q=80",
    label: "Покой джунглей",
  },
];

export default function Gallery() {
  return (
    <section className="py-25 px-[5vw] bg-[#e8d5bc]">
      <div className="text-center mb-17.5">
        <div className="text-[0.7rem] tracking-[0.3em] uppercase text-[#b5633a] mb-5 font-medium">
          Атмосфера
        </div>
        <h2 className="font-['Cormorant_Garamond',serif] text-[clamp(2.2rem,5vw,4rem)] font-light text-[#2a1f14] leading-[1.2]">
          Мир, в котором
          <br />
          <em className="italic text-[#b5633a]">время замирает</em>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-300 mx-auto mt-15">
        {GALLERY_IMAGES.map((img, i) => (
          <div
            key={i}
            className={`overflow-hidden relative cursor-pointer group`}
          >
            <Image
              src={img.url}
              alt={img.label}
              width={800}
              height={533}
              className="w-full h-full object-cover transition-transform duration-500 saturate-90 group-hover:scale-105 group-hover:saturate-110"
              style={{ height: "280px" }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-linear-to-t from-[#1a2e1e]/70 to-transparent text-[#f5ede0] text-[0.72rem] tracking-[0.2em] uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {img.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
