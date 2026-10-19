import Reveal from "@/app/ui/motion/reveal";
import ScrollText from "@/app/ui/motion/scroll_text";
import { Leaf } from "@/app/ui/motion/decor";

// Brand statement whose words light up while scrolling
export default function Philosophy() {
  return (
    <section className="relative overflow-hidden bg-cream px-5 py-32 md:px-8 md:py-48">
      <Leaf className="pointer-events-none absolute left-[8%] top-16 h-28 -rotate-12 text-terracotta/20 animate-float" />
      <Leaf className="pointer-events-none absolute bottom-16 right-[10%] h-20 rotate-[25deg] text-forest/15 animate-float [animation-delay:-3s]" />

      <div className="relative mx-auto max-w-5xl text-center">
        <Reveal variant="fade">
          <span className="font-display text-7xl leading-none text-gold">
            “
          </span>
        </Reveal>
        <ScrollText
          text="Мы создали пространство, где древние балийские традиции встречаются с современным пониманием тела. Каждый сеанс — это путешествие, а не просто процедура."
          className="font-display text-[clamp(1.9rem,4.2vw,3.6rem)] font-light leading-[1.25] text-forest"
        />
        <Reveal
          variant="up"
          className="mt-12 flex items-center justify-center gap-4"
        >
          <span className="h-px w-12 bg-terracotta" />
          <span className="text-xs uppercase tracking-[0.4em] text-terracotta">
            Философия Niko Massage
          </span>
          <span className="h-px w-12 bg-terracotta" />
        </Reveal>
      </div>
    </section>
  );
}
