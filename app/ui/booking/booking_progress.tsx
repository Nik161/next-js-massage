import clsx from "clsx";
import { CheckIcon } from "@heroicons/react/20/solid";

export const BOOKING_STEPS = ["Массажист", "Программа", "Дата и время"];

export default function BookingProgress({
  step,
  setStep,
}: {
  step: number;
  setStep: (step: number) => void;
}) {
  return (
    <nav aria-label="Шаги записи" className="mb-10">
      <ol className="relative flex justify-between">
        {/* Track behind the circles; the gold part grows with progress */}
        <div className="absolute inset-x-[16.6%] top-5 h-0.5 rounded-full bg-line">
          <div
            className="h-full rounded-full bg-linear-to-r from-gold to-terracotta transition-[width] duration-700 ease-out-expo"
            style={{
              width: `${((step - 1) / (BOOKING_STEPS.length - 1)) * 100}%`,
            }}
          />
        </div>

        {BOOKING_STEPS.map((label, index) => {
          const stepNumber = index + 1;
          const isDone = stepNumber < step;
          const isCurrent = stepNumber === step;

          return (
            <li
              key={label}
              className="relative z-10 flex flex-1 justify-center"
            >
              <button
                type="button"
                // Completed steps are clickable to go back to them.
                disabled={!isDone}
                onClick={() => setStep(stepNumber)}
                aria-current={isCurrent ? "step" : undefined}
                className="group flex flex-col items-center gap-2 disabled:cursor-default"
              >
                <span
                  className={clsx(
                    "flex size-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-all duration-500 ease-out-expo",
                    isDone &&
                      "border-gold bg-gold text-forest group-hover:scale-110",
                    isCurrent &&
                      "scale-110 border-forest bg-forest text-cream shadow-lift ring-4 ring-forest/10",
                    !isDone && !isCurrent && "border-line bg-white text-muted",
                  )}
                >
                  {isDone ? (
                    <CheckIcon className="size-5 animate-pop" />
                  ) : (
                    stepNumber
                  )}
                </span>
                <span
                  className={clsx(
                    "text-xs font-medium transition-colors duration-300 sm:text-sm",
                    isCurrent ? "text-ink" : "text-muted",
                    isDone && "group-hover:text-gold-dark",
                  )}
                >
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
