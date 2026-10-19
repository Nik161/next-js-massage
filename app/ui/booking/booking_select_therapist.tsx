import type { Therapist } from "@/app/lib/definitions";
import SelectableButton from "@/app/ui/booking/selectable_button";
import { NextButton, StepHeader } from "@/app/ui/booking/step_navigation";
import { BOOKING_STEPS } from "@/app/ui/booking/booking_progress";

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
      <StepHeader
        step={1}
        totalSteps={BOOKING_STEPS.length}
        title="Выберите массажиста"
        subtitle="Специалист, у которого вы хотите пройти сеанс."
      />

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {therapists.map((therapist, index) => (
          <SelectableButton
            key={therapist.id}
            selected={selectedTherapist === therapist.id}
            onClick={() => onSelect(therapist.id)}
            style={{ animationDelay: `${index * 80}ms` }}
            className="flex animate-fade-up flex-col gap-4 p-6"
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-linear-to-br from-forest-soft to-forest font-display text-3xl text-gold ring-4 ring-gold/15">
              {therapist.name[0]}
            </span>
            <span>
              <span className="block font-display text-2xl font-medium text-ink">
                {therapist.name}
              </span>
              {therapist.description && (
                <span className="mt-1 block whitespace-pre-line text-sm leading-relaxed text-muted">
                  {therapist.description}
                </span>
              )}
            </span>
          </SelectableButton>
        ))}
      </div>

      <div className="mt-10 flex justify-end">
        <NextButton disabled={!selectedTherapist} onClick={onNext} />
      </div>
    </section>
  );
}
