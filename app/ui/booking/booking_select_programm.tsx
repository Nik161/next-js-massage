import { MASSAGE_DURATIONS } from "@/app/constants/massage_durations";
import type { MassageType } from "@/app/lib/definitions";
import SelectableButton from "@/app/ui/booking/selectable_button";
import { BackButton, NextButton } from "@/app/ui/booking/step_navigation";

export default function BookingSelectProgramm({
  massageTypes,
  selectedMassage,
  selectedDuration,
  onMassageChange,
  onDurationChange,
  onBack,
  onNext,
}: {
  massageTypes: MassageType[];
  selectedMassage: string;
  selectedDuration: number;
  onMassageChange: (massageTypeId: string) => void;
  onDurationChange: (duration: number) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <section>
      <h2 className="text-2xl font-medium text-gray-900">Выберите программу</h2>

      <p className="mt-2 text-sm text-gray-500">
        Выберите программу и продолжительность сеанса.
      </p>

      <div className="mt-6">
        <p className="mb-3 text-sm font-medium text-gray-900">Программа</p>

        <div className="grid gap-3">
          {massageTypes.map((massage) => (
            <SelectableButton
              key={massage.id}
              selected={selectedMassage === massage.id}
              onClick={() => onMassageChange(massage.id)}
              className="p-4 text-left"
            >
              <div className="font-medium">{massage.name}</div>
            </SelectableButton>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-sm font-medium text-gray-900">
          Продолжительность
        </p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {MASSAGE_DURATIONS.map((duration) => (
            <SelectableButton
              key={duration}
              selected={selectedDuration === duration}
              onClick={() => onDurationChange(duration)}
              className="px-4 py-3 font-medium"
            >
              {duration} мин.
            </SelectableButton>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <BackButton onClick={onBack} />
        <NextButton
          disabled={!selectedMassage || !selectedDuration}
          onClick={onNext}
        />
      </div>
    </section>
  );
}
