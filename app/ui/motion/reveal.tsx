"use client";

import { useEffect, useRef, useState } from "react";

export type RevealVariant =
  | "up"
  | "fade"
  | "scale"
  | "blur"
  | "left"
  | "right"
  | "wipe"
  | "wipe-x"
  | "none";

type RevealTag =
  | "div"
  | "section"
  | "span"
  | "li"
  | "p"
  | "h1"
  | "h2"
  | "h3"
  | "figure"
  | "article"
  | "header";

// Plays a CSS entrance animation (see [data-reveal] in globals.css) the first
// time the element scrolls into view. "none" only marks children as visible,
// which is how SplitWords and .grow-line inside it get triggered.
export default function Reveal({
  as: Tag = "div",
  variant = "up",
  delay = 0,
  threshold = 0.2,
  className,
  style,
  children,
  ...rest
}: {
  as?: RevealTag;
  variant?: RevealVariant;
  delay?: number;
  threshold?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "style" | "className">) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -6% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  const Component = Tag as "div";

  return (
    <Component
      ref={ref}
      data-reveal={variant}
      data-visible={isVisible || undefined}
      className={className}
      style={
        { "--reveal-delay": `${delay}ms`, ...style } as React.CSSProperties
      }
      {...rest}
    >
      {children}
    </Component>
  );
}
