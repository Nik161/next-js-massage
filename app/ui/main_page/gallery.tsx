import Image from "next/image";
import clsx from "clsx";
import HorizontalScroll from "@/app/ui/motion/horizontal_scroll";
import SectionHeading from "@/app/ui/main_page/section_heading";

const GALLERY_IMAGES = [
  { url: "/images/main_hero.jpeg", label: "Камни и масла", wide: true },
  { url: "/images/massage_back.jpeg", label: "Ритуалы Бали", wide: false },
  { url: "/images/pool_view.jpeg", label: "Открытый павильон", wide: true },
  { url: "/images/towel_oil.jpeg", label: "Лепестки и свет", wide: false },
  { url: "/images/open_bath.jpeg", label: "Покой джунглей", wide: true },
  { url: "/images/woman_abs.jpeg", label: "Тело в балансе", wide: false },
];

export default function Gallery() {
  return (
    <section id="gallery" className="grain relative bg-forest-deep">
      <HorizontalScroll
        header={
          <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-6 px-5 md:flex-row md:items-end md:px-8">
            <SectionHeading
              tone="dark"
              eyebrow="Атмосфера"
              title="Мир, в котором"
              accent="время замирает"
            />
            <p className="hidden max-w-xs text-sm font-light leading-relaxed text-cream/50 lg:block">
              Листайте, чтобы прогуляться по пространству салона.
            </p>
          </div>
        }
      >
        {GALLERY_IMAGES.map((image, i) => (
          <figure
            key={image.url}
            className={clsx(
              "group relative h-[60vh] max-h-[560px] min-h-[340px] shrink-0 snap-center overflow-hidden rounded-3xl",
              image.wide ? "w-[85vw] lg:w-[44vw]" : "w-[70vw] lg:w-[28vw]",
              i % 2 === 1 && "lg:mt-16",
            )}
          >
            {/* Inner image drifts against the track for depth */}
            <div
              className="absolute -inset-x-[12%] inset-y-0"
              style={{
                transform: `translateX(calc((var(--progress) - ${i / GALLERY_IMAGES.length}) * -12%))`,
              }}
            >
              <Image
                src={image.url}
                alt={image.label}
                fill
                sizes="(min-width: 1024px) 45vw, 85vw"
                className="object-cover saturate-[0.85] transition-all duration-1000 ease-out-expo group-hover:scale-105 group-hover:saturate-110"
              />
            </div>
            <div className="absolute inset-0 bg-linear-to-t from-forest-deep/80 via-transparent to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between p-7 text-cream">
              <span className="translate-y-2 font-display text-3xl font-light italic transition-transform duration-700 ease-out-expo group-hover:translate-y-0">
                {image.label}
              </span>
              <span className="text-xs tracking-[0.3em] text-gold">
                0{i + 1} / 0{GALLERY_IMAGES.length}
              </span>
            </figcaption>
          </figure>
        ))}
      </HorizontalScroll>
    </section>
  );
}
