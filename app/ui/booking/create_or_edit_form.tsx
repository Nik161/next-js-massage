"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
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
  const [selection, setSelection] = useState(() =>
    getInitialSelection(booking),
  );

  const action = booking ? updateBooking.bind(null, booking.id) : createBooking;
  const [state, formAction, isPending] = useActionState(action, initialState);

  const updateSelection = (patch: Partial<BookingSelection>) =>
    setSelection((prev) => ({ ...prev, ...patch }));

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

  return (
    <form action={formAction} className="h-full w-full">
      {/* Values submitted to the server action */}
      <input type="hidden" name="therapist_id" value={selection.therapistId} />
      <input type="hidden" name="booking_date" value={selection.date} />
      <input type="hidden" name="booking_time" value={selection.time} />
      <input type="hidden" name="massage_type" value={selection.massageType} />
      <input type="hidden" name="booking_duration" value={selection.duration} />

      <div className="rounded-2xl bg-white p-5 shadow-sm md:p-8">
        <BookingProgress step={step} setStep={setStep} name={userName} />

        {step === 1 && (
          <BookingSelectTherapist
            therapists={therapists}
            selectedTherapist={selection.therapistId}
            // Free slots depend on the therapist, so the chosen time is reset.
            onSelect={(therapistId) =>
              updateSelection({ therapistId, time: "" })
            }
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <BookingSelectProgramm
            massageTypes={massageTypes}
            selectedMassage={selection.massageType}
            selectedDuration={selection.duration}
            onMassageChange={(massageType) => updateSelection({ massageType })}
            // A longer session may not fit into the chosen time.
            onDurationChange={(duration) =>
              updateSelection({ duration, time: "" })
            }
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
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
            onBack={() => setStep(2)}
            canSubmit={canSubmit && !isPending}
            submitText={booking ? "Обновить" : "Записаться"}
          />
        )}

        {state.message && (
          <p aria-live="polite" className="mt-4 text-sm text-red-500">
            {state.message}
          </p>
        )}
      </div>

      <div className="mt-6 mb-6">
        <Link
          href="/bookings"
          className="text-lg text-gray-500 transition hover:text-gray-900"
        >
          ← Вернуться к бронированиям
        </Link>
      </div>
    </form>
  );
}
