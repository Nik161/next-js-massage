import clsx from "clsx";
import Reveal from "@/app/ui/motion/reveal";
import SplitWords from "@/app/ui/motion/split_words";

// Eyebrow with a growing line + a heading whose words rise in.
// `accent` is rendered italic in the accent colour after `title`.
export default function SectionHeading({
  eyebrow,
  title,
  accent,
  after,
  align = "left",
  tone = "light",
  className,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  after?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
}) {
  const titleWords = title.split(" ").length;
  const accentWords = accent ? accent.split(" ").length : 0;

  return (
    <Reveal
      variant="none"
      className={clsx(align === "center" && "text-center", className)}
    >
      <div
        className={clsx(
          "flex items-center gap-4 text-[0.72rem] font-medium uppercase tracking-[0.35em]",
          align === "center" && "justify-center",
          tone === "light" ? "text-terracotta" : "text-gold",
        )}
      >
        <span className="grow-line h-px w-10 bg-current" />
        {eyebrow}
        {align === "center" && (
          <span className="grow-line h-px w-10 origin-right bg-current" />
        )}
      </div>
      <h2
        className={clsx(
          "mt-6 font-display text-[clamp(2.4rem,5.5vw,4.8rem)] font-light leading-[1.02] tracking-[-0.01em]",
          tone === "light" ? "text-forest" : "text-cream",
        )}
      >
        <SplitWords text={title} />
        {accent && (
          <em
            className={clsx(
              "italic",
              tone === "light" ? "text-terracotta" : "text-gold",
            )}
          >
            <SplitWords text={accent} offset={titleWords} />
          </em>
        )}
        {after && <SplitWords text={after} offset={titleWords + accentWords} />}
      </h2>
    </Reveal>
  );
}
