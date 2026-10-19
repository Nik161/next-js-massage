import clsx from "clsx";

// Option tile used by the booking wizard; dark when selected.
export default function SelectableButton({
  selected,
  onClick,
  className,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={clsx(
        "rounded-xl border transition-all",
        selected
          ? "border-gray-900 bg-gray-900 text-white"
          : "border-gray-200 bg-white text-gray-900 hover:border-gray-400",
        className,
      )}
    >
      {children}
    </button>
  );
}
