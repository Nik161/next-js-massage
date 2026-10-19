import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { getTherapists } from "@/app/lib/data/therapists";
import Reveal from "@/app/ui/motion/reveal";
import { Leaf, PalmFrond } from "@/app/ui/motion/decor";
import SectionHeading from "@/app/ui/main_page/section_heading";

export default async function Masters() {
  // The landing page must still render if the database is unavailable.
  const therapists = await getTherapists().catch(() => []);
  if (therapists.length === 0) return null;

  return (
    <section
      id="masters"
      className="relative overflow-hidden bg-cream px-5 py-28 md:px-8 md:py-40"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          align="center"
          eyebrow="Мастера"
          title="Руки, которым"
          accent="доверяют"
        />

        <div className="mx-auto mt-20 grid max-w-5xl gap-10 md:grid-cols-2">
          {therapists.map((therapist, i) => (
            <Reveal
              key={therapist.id}
              as="article"
              variant="up"
              delay={i * 180}
              className="group"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-t-full bg-linear-to-b from-forest-soft to-forest shadow-lift transition-transform duration-1000 ease-out-expo group-hover:-translate-y-2">
                {therapist.image_url ? (
                  <Image
                    src={therapist.image_url}
                    alt={therapist.name}
                    fill
                    // Photos may live on any host; skip the optimizer allowlist
                    unoptimized
                    sizes="(min-width: 768px) 40vw, 90vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                ) : (
                  <>
                    <PalmFrond className="absolute -bottom-10 left-1/2 h-[110%] -translate-x-1/2 origin-bottom text-gold/15 transition-transform duration-1000 group-hover:rotate-6" />
                    <span className="absolute inset-0 flex items-center justify-center font-display text-[11rem] font-light italic text-gold/90 transition-transform duration-1000 ease-out-expo group-hover:scale-110">
                      {therapist.name[0]}
                    </span>
                  </>
                )}
                <div className="absolute inset-0 rounded-t-full ring-1 ring-inset ring-gold/30" />
                <Leaf className="absolute bottom-6 right-8 h-14 text-gold/40 animate-float" />
              </div>

              <div className="mt-8 text-center">
                <h3 className="font-display text-4xl font-light text-forest">
                  {therapist.name}
                </h3>
                {therapist.description && (
                  <p className="mx-auto mt-3 max-w-sm whitespace-pre-line font-light leading-relaxed text-earth">
                    {therapist.description}
                  </p>
                )}
                <Link
                  href={`/bookings/create?therapist=${therapist.id}`}
                  className="group/link mt-6 inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-terracotta"
                >
                  Записаться к мастеру
                  <ArrowRightIcon className="size-4 transition-transform duration-500 group-hover/link:translate-x-1.5" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
