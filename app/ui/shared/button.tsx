import clsx from "clsx";

type ButtonVariant = "primary" | "accent" | "ghost";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-forest text-cream shadow-soft hover:bg-forest-soft hover:shadow-lift",
  accent:
    "bg-terracotta text-cream shadow-soft hover:bg-terracotta-light hover:shadow-lift",
  ghost: "bg-transparent text-ink hover:bg-sage",
};

// Shared look for buttons and button-like links
export function buttonClassName(
  variant: ButtonVariant = "primary",
  className?: string,
) {
  return clsx(
    "inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[0.95rem] font-medium tracking-wide",
    "transition-all duration-300 ease-out-expo active:scale-[0.97]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
    "disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40",
    VARIANTS[variant],
    className,
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

export function Button({
  children,
  className,
  variant = "primary",
  ...rest
}: ButtonProps) {
  return (
    <button {...rest} className={buttonClassName(variant, className)}>
      {children}
    </button>
  );
}
