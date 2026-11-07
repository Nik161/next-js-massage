"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import {
  ArrowLeftIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import type {
  BookingResponse,
  MassageType,
  Therapist,
} from "@/app/lib/definitions";
import BookingProgress from "@/app/ui/booking/booking_progress";
import BookingSelectTherapist from "@/app/ui/booking/booking_select_therapist";
import BookingSelectDateAndTime from "@/app/ui/booking/booking_select_date_time";
import BookingSelectProgramm from "@/app/ui/booking/booking_select_programm";
import BookingSummary from "@/app/ui/booking/booking_summary";
import { useAvailableSlots } from "@/app/ui/booking/use_available_slots";
import {
  useAppDispatch,
  useAppSelector,
  useAppStore,
} from "@/app/lib/store/hooks";
import {
  bookingFormStarted,
  dateSelected,
  durationSelected,
  getInitialSelection,
  massageTypeSelected,
  selectCanSubmit,
  selectDirection,
  selectIsSubmitting,
  selectSelection,
  selectStep,
  selectSubmitResult,
  stepChanged,
  submitBooking,
  therapistSelected,
  timeSelected,
} from "@/app/lib/store/booking_form_slice";
import { selectBalance, selectUserName } from "@/app/lib/store/user_slice";

export default function CreateOrEditBookingForm({
  booking,
  therapists,
  massageTypes,
  initialTherapistId,
}: {
  booking?: BookingResponse;
  therapists: Therapist[];
  initialTherapistId?: string;
  massageTypes: MassageType[];
}) {
  // Reset the form state before the first read, so the server render and
  // hydration already show this booking (or a fresh form).
  const store = useAppStore();
  const isStarted = useRef<true | null>(null);
  if (isStarted.current == null) {
    store.dispatch(
      bookingFormStarted(getInitialSelection(booking, initialTherapistId)),
    );
    isStarted.current = true;
  }

  const dispatch = useAppDispatch();
  const step = useAppSelector(selectStep);
  const direction = useAppSelector(selectDirection);
  const selection = useAppSelector(selectSelection);
  const canSubmit = useAppSelector(selectCanSubmit);
  const userName = useAppSelector(selectUserName);
  // The signed-in user's minutes; only shown when creating a booking for them
  const userBalance = useAppSelector(selectBalance);
  const balance = booking ? undefined : userBalance;
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const state = useAppSelector(selectSubmitResult);
  const isPending = useAppSelector(selectIsSubmitting);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || isPending) return;
    const result = await dispatch(submitBooking({ bookingId: booking?.id }));
    if (submitBooking.fulfilled.match(result)) {
      router.push("/bookings");
      router.refresh();
    }
  };

  const goToStep = (nextStep: number) => {
    dispatch(stepChanged(nextStep));

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

  const therapist = therapists.find((t) => t.id === selection.therapistId);
  const massage = massageTypes.find((m) => m.id === selection.massageType);

  return (
    <form
      onSubmit={handleSubmit}
      className="grid w-full items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]"
    >
      {/* The submitted values, also readable without the store */}
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
              onSelect={(therapistId) =>
                dispatch(therapistSelected(therapistId))
              }
              onNext={() => goToStep(2)}
            />
          )}

          {step === 2 && (
            <BookingSelectProgramm
              massageTypes={massageTypes}
              selectedMassage={selection.massageType}
              selectedDuration={selection.duration}
              balance={balance}
              onMassageChange={(massageType) =>
                dispatch(massageTypeSelected(massageType))
              }
              onDurationChange={(duration) =>
                dispatch(durationSelected(duration))
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
              onDateChange={(date) => dispatch(dateSelected(date))}
              onTimeChange={(time) => dispatch(timeSelected(time))}
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
