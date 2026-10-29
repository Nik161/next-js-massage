import clsx from "clsx";
import { CheckIcon } from "@heroicons/react/20/solid";

// Option tile used by the booking wizard
export default function SelectableButton({
  selected,
  onClick,
  disabled = false,
  variant = "card",
  className,
  style,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  // "card" is a large tile with a check badge, "chip" a compact pill
  variant?: "card" | "chip";
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={clsx(
        "relative border transition-all duration-300 ease-out-expo active:scale-[0.97]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
        variant === "card" && [
          "rounded-2xl text-left",
          selected
            ? "border-gold bg-gold-soft/60 shadow-soft ring-4 ring-gold/15"
            : "border-line bg-white hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-soft",
        ],
        variant === "chip" && [
          "rounded-xl text-center",
          selected
            ? "border-forest bg-forest text-cream shadow-soft"
            : "border-line bg-white text-ink enabled:hover:border-forest/40 enabled:hover:bg-sage/60",
        ],
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100",
        className,
      )}
    >
      {variant === "card" && selected && (
        <span className="absolute right-3 top-3 z-10 flex size-6 animate-pop items-center justify-center rounded-full bg-gold text-forest">
          <CheckIcon className="size-4" />
        </span>
      )}
      {children}
    </button>
  );
}
