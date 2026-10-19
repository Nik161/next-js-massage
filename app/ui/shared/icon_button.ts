import clsx from "clsx";

type IconButtonTone = "neutral" | "danger" | "gold" | "forest";

const TONES: Record<IconButtonTone, string> = {
  neutral: "hover:border-forest/30 hover:bg-sage hover:text-forest",
  danger:
    "hover:border-terracotta/40 hover:bg-terracotta-soft hover:text-terracotta",
  gold: "border-gold/50 text-gold-dark hover:bg-gold hover:text-forest",
  forest: "border-forest/30 text-forest hover:bg-forest hover:text-cream",
};

// Round bordered button used for row actions (edit, delete, ...)
export function iconButtonClassName(
  disabled = false,
  tone: IconButtonTone = "neutral",
) {
  return clsx(
    "inline-flex size-10 items-center justify-center rounded-full border transition-all duration-200",
    disabled
      ? "cursor-not-allowed border-line bg-sand text-muted/40"
      : clsx(
          "border-line bg-white text-muted hover:-translate-y-0.5 hover:shadow-soft active:scale-95",
          TONES[tone],
        ),
  );
}
