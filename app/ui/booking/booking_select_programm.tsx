import { Button } from "@/app/ui/shared/button";
import { MASSAGE_TYPES } from "@/app/constants/massage_types";
import { MASSAGE_DURATIONS } from "@/app/constants/massage_durations";

export default function BookingSelectProgramm({
  selectedMassage,
  setSelectedMassage,
  selectedDuration,
  setSelectedDuration,
  selectedTherapist,
  selectedTime,
  setStep,
  selectedDate,
  canSubmit,
  buttonText,
}: {
  selectedMassage: string;
  setSelectedMassage: (value: string) => void;
  selectedDuration: number;
  setSelectedDuration: (value: number) => void;
  selectedTherapist: string;
  selectedDate: string;
  selectedTime: string;
  setStep: (value: number) => void;
  canSubmit: boolean;
  buttonText: string;
}) {
  return (
    <section>
      <h2 className="text-2xl font-medium text-gray-900">Выберите программу</h2>

      <p className="mt-2 text-sm text-gray-500">
        Выберите программу и продолжительность сеанса.
      </p>

      {/* Massage type */}

      <div className="mt-6">
        <p className="mb-3 text-sm font-medium text-gray-900">Программа</p>

        <div className="grid gap-3">
          {MASSAGE_TYPES.map((massage) => {
            const isSelected = selectedMassage === massage.id;

            return (
              <button
                key={massage.id}
                type="button"
                onClick={() => setSelectedMassage(massage.id)}
                className={
                  isSelected
                    ? "rounded-xl border border-gray-900 bg-gray-900 p-4 text-left text-white transition-all"
                    : "rounded-xl border border-gray-200 bg-white p-4 text-left text-gray-900 transition-all hover:border-gray-400"
                }
              >
                <div className="font-medium">{massage.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration */}

      <div className="mt-6">
        <p className="mb-3 text-sm font-medium text-gray-900">
          Продолжительность
        </p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {MASSAGE_DURATIONS.map((duration) => {
            const value = duration;

            const isSelected = selectedDuration === value;

            return (
              <button
                key={value}
                type="button"
                onClick={() => setSelectedDuration(value)}
                className={
                  isSelected
                    ? "rounded-xl border border-gray-900 bg-gray-900 px-4 py-3 font-medium text-white transition-all"
                    : "rounded-xl border border-gray-200 bg-white px-4 py-3 font-medium text-gray-900 transition-all hover:border-gray-400"
                }
              >
                {duration} мин.
              </button>
            );
          })}
        </div>
      </div>

      {/* Hidden fields */}

      <input type="hidden" name="therapist_id" value={selectedTherapist} />

      <input type="hidden" name="booking_time" value={selectedTime} />

      <input type="hidden" name="massage_type" value={selectedMassage} />

      <input type="hidden" name="booking_duration" value={selectedDuration} />

      <input type="hidden" name="booking_date" value={selectedDate} />

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="rounded-xl bg-gray-100 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-200"
        >
          Назад
        </button>

        <Button type="submit" disabled={!canSubmit}>
          {buttonText}
        </Button>
      </div>
    </section>
  );
}
