"use client";

import { useRef } from "react";
import clsx from "clsx";

// 3D tilt towards the cursor plus a soft spotlight that follows it.
// Exposes --mx / --my (spotlight position) to children via CSS.
export default function TiltCard({
  maxTilt = 8,
  className,
  children,
}: {
  maxTilt?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    element.style.setProperty("--mx", `${px * 100}%`);
    element.style.setProperty("--my", `${py * 100}%`);
    element.style.transform = `perspective(1000px) rotateX(${(0.5 - py) * maxTilt}deg) rotateY(${(px - 0.5) * maxTilt}deg)`;
  };

  const onPointerLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={clsx("group/tilt relative", className)}
      style={{
        transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Spotlight */}
      <div
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/tilt:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgb(201 168 76 / 0.18), transparent 60%)",
        }}
      />
      {children}
    </div>
  );
}
