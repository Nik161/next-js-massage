"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/app/ui/motion/use_reduced_motion";

// Moves its content slower or faster than the page while scrolling.
// The parent is measured, so the moving element never feeds back into itself.
export default function Parallax({
  speed = 0.2,
  minWidth = 0,
  className,
  children,
}: {
  // Positive values lag behind the scroll, negative ones move ahead
  speed?: number;
  // Only move on viewports at least this wide (px)
  minWidth?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    const anchor = element?.parentElement;
    if (!element || !anchor || prefersReducedMotion()) return;
    if (!window.matchMedia(`(min-width: ${minWidth}px)`).matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = anchor.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;
      const offset = rect.top + rect.height / 2 - window.innerHeight / 2;
      element.style.transform = `translate3d(0, ${offset * speed}px, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [speed, minWidth]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
