"use client";

import { useRef } from "react";

// Pulls its content slightly towards the cursor.
export default function Magnetic({
  strength = 0.3,
  className,
  children,
}: {
  strength?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const onPointerMove = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (event.pointerType !== "mouse") return;
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    element.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
  };

  const onPointerLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <span
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={className}
      style={{
        display: "inline-block",
        transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {children}
    </span>
  );
}
