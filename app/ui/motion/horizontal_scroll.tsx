"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/app/ui/motion/use_reduced_motion";

// On desktop the section sticks while vertical scrolling moves its track
// sideways. On touch screens and small viewports it is a native swipe row.
// Exposes --progress (0..1) on the track for scroll-linked effects.
export default function HorizontalScroll({
  header,
  children,
}: {
  header: React.ReactNode;
  children: React.ReactNode;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const desktop = window.matchMedia("(min-width: 1024px)");
    let frame = 0;
    let distance = 0;

    const measure = () => {
      if (!desktop.matches || prefersReducedMotion()) {
        section.style.height = "";
        track.style.transform = "";
        distance = 0;
        return;
      }
      distance = Math.max(0, track.scrollWidth - window.innerWidth);
      section.style.height = `${window.innerHeight + distance}px`;
      update();
    };

    const update = () => {
      frame = 0;
      if (!distance) return;
      const rect = section.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / distance));
      track.style.transform = `translate3d(${-progress * distance}px, 0, 0)`;
      track.style.setProperty("--progress", String(progress));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    desktop.addEventListener("change", measure);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      desktop.removeEventListener("change", measure);
    };
  }, []);

  return (
    <div ref={sectionRef} className="relative">
      <div className="flex flex-col justify-center overflow-hidden py-24 lg:sticky lg:top-0 lg:h-screen lg:py-0">
        {header}
        <div
          ref={trackRef}
          className="no-scrollbar mt-12 flex snap-x gap-6 overflow-x-auto px-[5vw] will-change-transform lg:overflow-visible"
          style={{ "--progress": 0 } as React.CSSProperties}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
