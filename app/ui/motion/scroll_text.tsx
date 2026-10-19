"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";

// Words light up one by one as the paragraph scrolls through the viewport.
export default function ScrollText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const start = window.innerHeight * 0.85;
      const end = window.innerHeight * 0.35;
      const progress = (start - rect.top) / (start - end + rect.height * 0.6);
      element.style.setProperty(
        "--p",
        String(Math.min(1, Math.max(0, progress))),
      );
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
  }, []);

  return (
    <p
      ref={ref}
      className={clsx(className)}
      style={{ "--n": words.length, "--p": 0 } as React.CSSProperties}
    >
      {words.map((word, index) => (
        <span
          key={index}
          className="transition-opacity duration-300"
          style={{
            opacity: `clamp(0.14, calc(var(--p) * var(--n) - ${index}), 1)`,
          }}
        >
          {word}{" "}
        </span>
      ))}
    </p>
  );
}
