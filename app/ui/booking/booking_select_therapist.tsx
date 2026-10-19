import clsx from "clsx";
import type { Therapist } from "@/app/lib/definitions";
import SelectableButton from "@/app/ui/booking/selectable_button";
import { NextButton } from "@/app/ui/booking/step_navigation";

export default function BookingSelectTherapist({
  therapists,
  selectedTherapist,
  onSelect,
  onNext,
}: {
  therapists: Therapist[];
  selectedTherapist: string;
  onSelect: (therapistId: string) => void;
  onNext: () => void;
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
        {therapists.map((therapist) => {
          const isSelected = selectedTherapist === therapist.id;

          return (
            <SelectableButton
              key={therapist.id}
              selected={isSelected}
              onClick={() => onSelect(therapist.id)}
              className="p-5 text-left"
            >
              <h3 className="text-3xl font-medium">{therapist.name}</h3>
              {therapist.description && (
                <div
                  className={clsx(
                    "mt-1 whitespace-pre-line text-lg font-medium",
                    isSelected ? "text-gray-200" : "text-gray-500",
                  )}
                >
                  {therapist.description}
                </div>
              )}
            </SelectableButton>
          );
        })}
      </div>

      <div className="mt-8 flex justify-end">
        <NextButton disabled={!selectedTherapist} onClick={onNext} />
      </div>
    </section>
  );
}
