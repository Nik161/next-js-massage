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
              <div className="relative transition-transform duration-1000 ease-out-expo group-hover:-translate-y-2">
                {/* Offset gold arch that echoes the frame and opens up on hover */}
                <div className="pointer-events-none absolute -inset-3 rounded-t-full border border-gold/30 transition-all duration-1000 ease-out-expo group-hover:-inset-5 group-hover:border-gold/60" />

                <div className="grain relative aspect-[2/3] overflow-hidden rounded-t-full bg-linear-to-b from-forest-soft to-forest shadow-lift">
                  {therapist.image_url ? (
                    <>
                      <Image
                        src={therapist.image_url}
                        alt={therapist.name}
                        fill
                        // Local photos go through the optimizer; remote hosts would need an allowlist
                        unoptimized={!therapist.image_url.startsWith("/")}
                        sizes="(min-width: 768px) 50vw, 90vw"
                        // Faces usually sit in the upper third, which the arch would otherwise crop
                        className="object-cover object-[50%_30%] saturate-85 sepia-10 transition-[transform,filter] duration-1000 ease-out-expo group-hover:scale-105 group-hover:saturate-100 group-hover:sepia-0"
                      />
                      {/* Warm the photo into the palette and ground the leaf decor */}
                      <div className="absolute inset-0 bg-linear-to-t from-forest/55 via-forest/5 to-transparent transition-opacity duration-1000 group-hover:opacity-70" />
                      <div className="absolute inset-0 bg-terracotta/10 mix-blend-soft-light" />
                      <div className="absolute inset-0 rounded-t-full shadow-[inset_0_0_90px_rgba(15,28,16,0.45)]" />
                    </>
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
