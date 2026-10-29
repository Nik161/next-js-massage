import { ClockIcon } from "@heroicons/react/24/outline";
import { MASSAGE_DURATIONS } from "@/app/constants/massage_durations";
import type { MassageType } from "@/app/lib/definitions";
import SelectableButton from "@/app/ui/booking/selectable_button";
import BalanceBadge from "@/app/ui/booking/balance_badge";
import {
  BackButton,
  NextButton,
  StepHeader,
} from "@/app/ui/booking/step_navigation";
import { BOOKING_STEPS } from "@/app/ui/booking/booking_progress";

export default function BookingSelectProgramm({
  massageTypes,
  selectedMassage,
  selectedDuration,
  balance,
  onMassageChange,
  onDurationChange,
  onBack,
  onNext,
}: {
  massageTypes: MassageType[];
  selectedMassage: string;
  selectedDuration: number;
  balance?: number;
  onMassageChange: (massageTypeId: string) => void;
  onDurationChange: (duration: number) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  // Without a balance (editing) every duration stays available
  const canAfford = (duration: number) =>
    balance === undefined || duration <= balance;
  const canAffordAny = MASSAGE_DURATIONS.some(canAfford);

  return (
    <section>
      <StepHeader
        step={2}
        totalSteps={BOOKING_STEPS.length}
        title="Выберите программу"
        subtitle="Техника массажа и продолжительность сеанса."
      />

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {massageTypes.map((massage, index) => (
          <SelectableButton
            key={massage.id}
            selected={selectedMassage === massage.id}
            onClick={() => onMassageChange(massage.id)}
            style={{ animationDelay: `${index * 60}ms` }}
            className="animate-fade-up p-5 pr-12"
          >
            <span className="block font-display text-xl font-medium text-ink">
              {massage.name}
            </span>
            {massage.description && (
              <span className="mt-1 block text-sm leading-relaxed text-muted">
                {massage.description}
              </span>
            )}
          </SelectableButton>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.15em] text-muted">
          <ClockIcon className="size-4" />
          Продолжительность
        </h3>
        {balance !== undefined && <BalanceBadge minutes={balance} />}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3">
        {MASSAGE_DURATIONS.map((duration) => (
          <SelectableButton
            key={duration}
            variant="chip"
            selected={selectedDuration === duration}
            onClick={() => onDurationChange(duration)}
            disabled={!canAfford(duration)}
            className="py-4"
          >
            <span className="block font-display text-2xl font-medium">
              {duration}
            </span>
            <span className="text-xs uppercase tracking-wider opacity-70">
              минут
            </span>
          </SelectableButton>
        ))}
      </div>

      {!canAffordAny && (
        <p className="mt-3 text-sm text-terracotta">
          Минут на балансе не хватает ни на одну программу. Баланс пополнится в
          понедельник.
        </p>
      )}

      <div className="mt-10 flex justify-between">
        <BackButton onClick={onBack} />
        <NextButton
          disabled={!selectedMassage || !selectedDuration}
          onClick={onNext}
        />
      </div>
    </section>
  );
}
