import { MASSAGE_THERAPISTS } from "@/app/constants/massage_therapists";
import clsx from "clsx";

export default function BookingSelectTherapist({
  setStep,
  selectedTherapist,
  setSelectedTherapist,
  setSelectedTime,
  canGoToTime,
}: {
  setStep: (step: number) => void;
  selectedTherapist: string;
  setSelectedTherapist: (therapist: string) => void;
  setSelectedTime: (time: string) => void;
  canGoToTime: boolean;
}) {
  return (
    <section>
      <h2 className="text-2xl font-medium text-gray-900">
        Выберите массажиста
      </h2>

      <p className="mt-2 text-xl text-gray-500">
        Выберите специалиста, у которого хотите пройти сеанс.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {MASSAGE_THERAPISTS.map((therapist) => {
          const isSelected = selectedTherapist === therapist.id;

          return (
            <button
              key={therapist.id}
              type="button"
              onClick={() => {
                setSelectedTherapist(therapist.id);
                setSelectedTime("");
              }}
              className={clsx(
                "rounded-xl border p-5 text-left transition-all",
                isSelected
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 bg-white text-gray-900 hover:border-gray-400",
              )}
            >
              <h1 className="text-3xl font-medium">{therapist.name}</h1>

              <div
                className={clsx(
                  "mt-1 text-lg font-medium",
                  isSelected ? "text-gray-200" : "text-gray-500",
                )}
              >
                {therapist.description}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          disabled={!canGoToTime}
          onClick={() => setStep(2)}
          className="rounded-xl bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Далее
        </button>
      </div>
    </section>
  );
}
