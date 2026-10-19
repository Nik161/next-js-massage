import clsx from "clsx";

export const BOOKING_STEPS = ["Массажист", "Программа", "Дата / Время"];

export default function BookingProgress({
  step,
  setStep,
  name,
}: {
  step: number;
  setStep: (step: number) => void;
  name: string;
}) {
  return (
    <>
      <div className="mb-8 flex">
        <span className="text-2xl text-gray-500">Вы записываетесь как</span>
        <h1 className="ml-2 text-2xl font-medium text-gray-900">{name}</h1>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between text-lg">
          {BOOKING_STEPS.map((label, index) => {
            const stepNumber = index + 1;

            // Completed steps are clickable to go back to them.
            return stepNumber < step ? (
              <button
                key={label}
                type="button"
                title={`Вернуться к шагу «${label}»`}
                onClick={() => setStep(stepNumber)}
                className="cursor-pointer"
              >
                {label}
              </button>
            ) : (
              <span
                key={label}
                className={clsx(
                  stepNumber === step
                    ? "font-medium text-gray-900"
                    : "text-gray-400",
                )}
              >
                {label}
              </span>
            );
          })}
        </div>

        <div className="mt-3 h-1 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gray-900 transition-all duration-300"
            style={{ width: `${(step / BOOKING_STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    </>
  );
}
