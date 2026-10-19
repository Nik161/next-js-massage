"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import {
  ArrowLeftIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import type {
  BookingFormState,
  BookingResponse,
  MassageType,
  Therapist,
} from "@/app/lib/definitions";
import { createBooking, updateBooking } from "@/app/lib/actions";
import { getToday } from "@/app/lib/booking_time";
import BookingProgress from "@/app/ui/booking/booking_progress";
import BookingSelectTherapist from "@/app/ui/booking/booking_select_therapist";
import BookingSelectDateAndTime from "@/app/ui/booking/booking_select_date_time";
import BookingSelectProgramm from "@/app/ui/booking/booking_select_programm";
import BookingSummary from "@/app/ui/booking/booking_summary";
import { useAvailableSlots } from "@/app/ui/booking/use_available_slots";

type BookingSelection = {
  therapistId: string;
  date: string;
  time: string;
  massageType: string;
  duration: number;
};

const initialState: BookingFormState = { message: null, errors: {} };

function getInitialSelection(booking?: BookingResponse): BookingSelection {
  if (!booking) {
    return {
      therapistId: "",
      date: getToday(),
      time: "",
      massageType: "",
      duration: 0,
    };
  }

  const [date, time] = booking.date.split(" ");
  return {
    therapistId: booking.therapist_id,
    date,
    time,
    massageType: booking.massage_type,
    duration: booking.duration,
  };
}

export default function CreateOrEditBookingForm({
  userName,
  booking,
  therapists,
  massageTypes,
}: {
  userName: string;
  booking?: BookingResponse;
  therapists: Therapist[];
  massageTypes: MassageType[];
}) {
  const [step, setStep] = useState(1);
  // Decides which side the next step slides in from
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [selection, setSelection] = useState(() =>
    getInitialSelection(booking),
  );
  const cardRef = useRef<HTMLDivElement>(null);

  const action = booking ? updateBooking.bind(null, booking.id) : createBooking;
  const [state, formAction, isPending] = useActionState(action, initialState);

  const updateSelection = (patch: Partial<BookingSelection>) =>
    setSelection((prev) => ({ ...prev, ...patch }));

  const goToStep = (nextStep: number) => {
    setDirection(nextStep > step ? "forward" : "back");
    setStep(nextStep);

    // On small screens the card top may be scrolled away
    const card = cardRef.current;
    if (card && card.getBoundingClientRect().top < 0) {
      card.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const { slots, isLoading, isError } = useAvailableSlots({
    therapistId: selection.therapistId,
    date: selection.date,
    duration: selection.duration,
    excludeBookingId: booking?.id,
  });

  const canSubmit = Boolean(
    selection.therapistId &&
    selection.date &&
    selection.time &&
    selection.massageType &&
    selection.duration,
  );

  const therapist = therapists.find((t) => t.id === selection.therapistId);
  const massage = massageTypes.find((m) => m.id === selection.massageType);

  return (
    <form
      action={formAction}
      className="grid w-full items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]"
    >
      {/* Values submitted to the server action */}
      <input type="hidden" name="therapist_id" value={selection.therapistId} />
      <input type="hidden" name="booking_date" value={selection.date} />
      <input type="hidden" name="booking_time" value={selection.time} />
      <input type="hidden" name="massage_type" value={selection.massageType} />
      <input type="hidden" name="booking_duration" value={selection.duration} />

      <div
        ref={cardRef}
        className="scroll-mt-24 animate-fade-up overflow-hidden rounded-3xl border border-line bg-white p-5 shadow-lift sm:p-8 md:p-10"
      >
        <BookingProgress step={step} setStep={goToStep} />

        <div
          key={step}
          className={
            direction === "forward"
              ? "animate-slide-in-right"
              : "animate-slide-in-left"
          }
        >
          {step === 1 && (
            <BookingSelectTherapist
              therapists={therapists}
              selectedTherapist={selection.therapistId}
              // Free slots depend on the therapist, so the chosen time is reset.
              onSelect={(therapistId) =>
                updateSelection({ therapistId, time: "" })
              }
              onNext={() => goToStep(2)}
            />
          )}

          {step === 2 && (
            <BookingSelectProgramm
              massageTypes={massageTypes}
              selectedMassage={selection.massageType}
              selectedDuration={selection.duration}
              onMassageChange={(massageType) =>
                updateSelection({ massageType })
              }
              // A longer session may not fit into the chosen time.
              onDurationChange={(duration) =>
                updateSelection({ duration, time: "" })
              }
              onBack={() => goToStep(1)}
              onNext={() => goToStep(3)}
            />
          )}

          {step === 3 && (
            <BookingSelectDateAndTime
              selectedDate={selection.date}
              selectedTime={selection.time}
              slots={slots}
              isLoading={isLoading}
              isError={isError}
              onDateChange={(date) => updateSelection({ date, time: "" })}
              onTimeChange={(time) => updateSelection({ time })}
              onBack={() => goToStep(2)}
              canSubmit={canSubmit && !isPending}
              isSubmitting={isPending}
              submitText={booking ? "Сохранить изменения" : "Записаться"}
            />
          )}
        </div>

        {state.message && (
          <p
            key={state.message}
            aria-live="polite"
            className="mt-6 flex animate-shake items-center gap-3 rounded-2xl bg-terracotta-soft p-4 text-sm text-terracotta"
          >
            <ExclamationCircleIcon className="size-5 shrink-0" />
            {state.message}
          </p>
        )}
      </div>

      <div className="space-y-4 lg:sticky lg:top-24">
        <BookingSummary
          userName={userName}
          therapistName={therapist?.name}
          massageName={massage?.name}
          duration={selection.duration || undefined}
          date={selection.date}
          time={selection.time}
        />

        <Link
          href="/bookings"
          className="group flex items-center justify-center gap-2 text-muted transition-colors hover:text-forest lg:justify-start"
        >
          <ArrowLeftIcon className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
          Вернуться к бронированиям
        </Link>
      </div>
    </form>
  );
}
