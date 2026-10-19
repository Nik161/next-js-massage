import clsx from "clsx";

// Line-art palm frond built from a stem and pairs of leaflets
const FROND_LEAFLETS = Array.from({ length: 11 }, (_, i) => {
  const t = (i + 1) / 12;
  const y = 400 - t * 370;
  const length = 22 + 78 * Math.sin(Math.PI * t);
  return { y, length };
});

export function PalmFrond({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 400"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M100 400 C 102 300, 96 150, 100 20" />
      {FROND_LEAFLETS.map(({ y, length }) => (
        <g key={y}>
          <path
            d={`M100 ${y} q ${-length * 0.55} ${-length * 0.12} ${-length} ${-length * 0.62}`}
          />
          <path
            d={`M100 ${y} q ${length * 0.55} ${-length * 0.12} ${length} ${-length * 0.62}`}
          />
        </g>
      ))}
    </svg>
  );
}

export function Leaf({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 160"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M50 4 C 92 36, 96 104, 50 156 C 4 104, 8 36, 50 4 Z" />
      <path d="M50 10 L50 156" />
      {[40, 64, 88, 112].map((y) => (
        <g key={y}>
          <path d={`M50 ${y} q -14 -6 -28 -18`} />
          <path d={`M50 ${y} q 14 -6 28 -18`} />
        </g>
      ))}
    </svg>
  );
}

// Deterministic positions so server and client render the same markup
const DUST = Array.from({ length: 22 }, (_, i) => ({
  left: (i * 37) % 100,
  bottom: (i * 23) % 60,
  size: 2 + (i % 3),
  duration: 7 + (i % 5) * 1.6,
  delay: (i * 0.7) % 8,
}));

export function GoldDust({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={clsx("pointer-events-none absolute inset-0", className)}
    >
      {DUST.map((particle, i) => (
        <span
          key={i}
          className="dust absolute rounded-full bg-gold shadow-[0_0_8px_rgb(201_168_76/0.8)]"
          style={
            {
              left: `${particle.left}%`,
              bottom: `${particle.bottom}%`,
              width: particle.size,
              height: particle.size,
              "--dur": `${particle.duration}s`,
              "--delay": `${particle.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

// Circular text that slowly rotates around a center mark
export function RotatingBadge({
  text,
  className,
  children,
}: {
  text: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={clsx("relative size-32", className)}>
      <svg
        viewBox="0 0 120 120"
        className="absolute inset-0 animate-spin-slow"
        aria-hidden="true"
      >
        <defs>
          <path
            id="badge-circle"
            d="M60 60 m -46 0 a 46 46 0 1 1 92 0 a 46 46 0 1 1 -92 0"
          />
        </defs>
        <text
          fill="currentColor"
          className="text-[9.5px] uppercase tracking-[0.32em]"
        >
          <textPath href="#badge-circle">{text}</textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export function Marquee({
  items,
  reverse = false,
  className,
  itemClassName,
}: {
  items: string[];
  reverse?: boolean;
  className?: string;
  itemClassName?: string;
}) {
  // Rendered twice so the -50% loop is seamless
  const row = [...items, ...items];

  return (
    <div className={clsx("group flex overflow-hidden", className)}>
      <div
        className={clsx(
          "flex shrink-0 items-center group-hover:[animation-play-state:paused]",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
        )}
      >
        {row.map((item, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center"
            aria-hidden={i >= items.length}
          >
            <span className={itemClassName}>{item}</span>
            <span className="mx-8 text-gold">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
