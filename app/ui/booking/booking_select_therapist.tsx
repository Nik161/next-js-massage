import Image from "next/image";
import clsx from "clsx";
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
            className="group flex animate-fade-up flex-col gap-4 p-4 sm:p-5"
          >
            {therapist.image_url ? (
              <span
                className={clsx(
                  "relative block aspect-[4/5] overflow-hidden rounded-xl bg-forest ring-1 transition-shadow duration-300",
                  selectedTherapist === therapist.id
                    ? "ring-gold/60"
                    : "ring-gold/15",
                )}
              >
                <Image
                  src={therapist.image_url}
                  alt={therapist.name}
                  fill
                  // Local photos go through the optimizer; remote hosts would need an allowlist
                  unoptimized={!therapist.image_url.startsWith("/")}
                  sizes="(min-width: 640px) 320px, 90vw"
                  // Faces usually sit in the upper third of a portrait
                  className="object-cover object-[50%_25%] transition-transform duration-700 ease-out-expo group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-linear-to-t from-forest/30 to-transparent" />
              </span>
            ) : (
              <span className="flex size-16 items-center justify-center rounded-full bg-linear-to-br from-forest-soft to-forest font-display text-3xl text-gold ring-4 ring-gold/15">
                {therapist.name[0]}
              </span>
            )}
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
