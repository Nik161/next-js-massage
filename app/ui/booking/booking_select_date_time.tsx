import clsx from "clsx";
import {
  ExclamationCircleIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import { formatDayParts, getBookingDays } from "@/app/lib/booking_time";
import { Button } from "@/app/ui/shared/button";
import Spinner from "@/app/ui/shared/spinner";
import SelectableButton from "@/app/ui/booking/selectable_button";
import { BackButton, StepHeader } from "@/app/ui/booking/step_navigation";
import { BOOKING_STEPS } from "@/app/ui/booking/booking_progress";
import { SlotsSkeleton } from "@/app/ui/booking/skeletons";

const DAY_PARTS = [
  { label: "Утро", Icon: SunIcon, matches: (hour: number) => hour < 12 },
  {
    label: "День",
    Icon: SunIcon,
    matches: (hour: number) => hour >= 12 && hour < 17,
  },
  { label: "Вечер", Icon: MoonIcon, matches: (hour: number) => hour >= 17 },
];

function DayPicker({
  selectedDate,
  onChange,
}: {
  selectedDate: string;
  onChange: (date: string) => void;
}) {
  return (
    <div className="no-scrollbar -mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-5 pt-2 [mask-image:linear-gradient(to_right,black_85%,transparent)]">
      {getBookingDays().map((date, index) => {
        const { weekday, day, month } = formatDayParts(date);
        const isSelected = date === selectedDate;

        return (
          <button
            key={date}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChange(date)}
            style={{ animationDelay: `${index * 25}ms` }}
            className={clsx(
              "flex w-16 shrink-0 animate-fade-up snap-start flex-col items-center rounded-2xl border py-3 transition-all duration-300 ease-out-expo active:scale-95",
              isSelected
                ? "border-forest bg-forest text-cream shadow-lift"
                : "border-line bg-white text-ink hover:-translate-y-0.5 hover:border-forest/40",
            )}
          >
            <span
              className={clsx(
                "text-[0.7rem] uppercase tracking-wider",
                isSelected ? "text-gold" : "text-muted",
              )}
            >
              {weekday}
            </span>
            <span className="font-display text-2xl font-medium leading-tight">
              {day}
            </span>
            <span className="text-[0.7rem] opacity-70">{month}</span>
          </button>
        );
      })}
    </div>
  );
}

function SlotsMessage({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "error";
  children: React.ReactNode;
}) {
  return (
    <p
      className={clsx(
        "flex animate-fade-in items-center gap-3 rounded-2xl p-5",
        tone === "error"
          ? "bg-terracotta-soft text-terracotta"
          : "bg-sand text-muted",
      )}
    >
      {tone === "error" && <ExclamationCircleIcon className="size-5" />}
      {children}
    </p>
  );
}

function SlotGroups({
  slots,
  selectedTime,
  onTimeChange,
}: {
  slots: string[];
  selectedTime: string;
  onTimeChange: (time: string) => void;
}) {
  let order = 0;

  return (
    <div className="space-y-6">
      {DAY_PARTS.map(({ label, Icon, matches }) => {
        const partSlots = slots.filter((slot) =>
          matches(Number(slot.slice(0, 2))),
        );
        if (partSlots.length === 0) return null;

        return (
          <div key={label}>
            <h4 className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-muted">
              <Icon className="size-4" />
              {label}
              <span className="text-muted/60">· {partSlots.length}</span>
            </h4>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {partSlots.map((slot) => (
                <SelectableButton
                  key={slot}
                  variant="chip"
                  selected={selectedTime === slot}
                  onClick={() => onTimeChange(slot)}
                  style={{ animationDelay: `${order++ * 20}ms` }}
                  className="animate-fade-up py-3 font-medium"
                >
                  {slot}
                </SelectableButton>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function BookingSelectDateAndTime({
  selectedDate,
  selectedTime,
  slots,
  isLoading,
  isError,
  onDateChange,
  onTimeChange,
  onBack,
  canSubmit,
  isSubmitting,
  submitText,
}: {
  selectedDate: string;
  selectedTime: string;
  slots: string[];
  isLoading: boolean;
  isError: boolean;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onBack: () => void;
  canSubmit: boolean;
  isSubmitting: boolean;
  submitText: string;
}) {
  return (
    <section>
      <StepHeader
        step={3}
        totalSteps={BOOKING_STEPS.length}
        title="Выберите дату и время"
        subtitle="Показываем только свободные окна массажиста."
      />

      <h3 className="mt-8 text-sm font-medium uppercase tracking-[0.15em] text-muted">
        Дата
      </h3>
      <DayPicker selectedDate={selectedDate} onChange={onDateChange} />

      <h3 className="mb-3 mt-6 text-sm font-medium uppercase tracking-[0.15em] text-muted">
        Время
      </h3>

      {/* Keyed by date so slots re-animate when the day changes */}
      <div key={selectedDate}>
        {isLoading ? (
          <SlotsSkeleton />
        ) : isError ? (
          <SlotsMessage tone="error">
            Не удалось загрузить свободное время. Попробуйте позже.
          </SlotsMessage>
        ) : slots.length === 0 ? (
          <SlotsMessage>
            На этот день свободных окон нет — выберите другую дату.
          </SlotsMessage>
        ) : (
          <SlotGroups
            slots={slots}
            selectedTime={selectedTime}
            onTimeChange={onTimeChange}
          />
        )}
      </div>

      <div className="mt-10 flex justify-between">
        <BackButton onClick={onBack} />
        <Button type="submit" variant="accent" disabled={!canSubmit}>
          {isSubmitting && <Spinner />}
          {submitText}
        </Button>
      </div>
    </section>
  );
}
