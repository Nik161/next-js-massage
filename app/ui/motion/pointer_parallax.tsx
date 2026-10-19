"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/app/ui/motion/use_reduced_motion";

// Shifts its content with the mouse position for a sense of depth.
export default function PointerParallax({
  depth = 20,
  className,
  children,
}: {
  // Maximum shift in pixels
  depth?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        element.style.transform = `translate3d(${x * depth}px, ${y * depth}px, 0)`;
      });
    };

    window.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, [depth]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ transition: "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      {children}
    </div>
  );
}
