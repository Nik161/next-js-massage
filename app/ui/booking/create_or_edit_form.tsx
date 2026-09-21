"use client";

import { AVAILABLE_MASSAGE_SLOTS } from "@/app/constants/available_massage_slots";
import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { User } from "next-auth";
import { BookingResponse, State } from "@/app/lib/definitions";
import { createBooking, updateBooking } from "@/app/lib/actions";
import BookingProgress from "@/app/ui/booking/booking_progress";
import BookingSelectTherapist from "@/app/ui/booking/booking_select_therapist";
import BookingSelectDateAndTime from "@/app/ui/booking/booking_select_date_time";
import BookingSelectProgramm from "@/app/ui/booking/booking_select_programm";
import { create } from "node:domain";

function getToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const maxDate = (() => {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  return date.toISOString().split("T")[0];
})();

function isToday(date: string) {
  return date === getToday();
}

function isTimeInPast(time: string) {
  const now = new Date();
  const [hours, minutes] = time.split(":").map(Number);
  const slotDate = new Date();
  slotDate.setHours(hours, minutes, 0, 0);
  return slotDate <= now;
}

export default function CreateOrEditBookingForm({
  user,
  booking,
}: {
  user: User | undefined;
  booking: BookingResponse | undefined;
}) {
  const initialBookingData = {
    therapist: booking ? booking.therapist_id : "",
    date: booking ? booking.date.split(" ")[0] : getToday(),
    time: booking ? booking.date.split(" ")[1] : "",
    massage: booking ? booking.massage_type : "",
    duration: booking ? booking.duration : 0,
  };

  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(initialBookingData.date);
  const [selectedTherapist, setSelectedTherapist] = useState(
    initialBookingData.therapist,
  );
  const [selectedTime, setSelectedTime] = useState(initialBookingData.time);
  const [selectedMassage, setSelectedMassage] = useState(
    initialBookingData.massage,
  );
  const [selectedDuration, setSelectedDuration] = useState(
    initialBookingData.duration,
  );

  const initialState: State = {
    message: null,
    errors: {},
  };

  const action = booking ? updateBooking.bind(null, booking.id) : createBooking;

  const [state, formAction] = useActionState(action, initialState);

  // Получаем слоты выбранного массажиста
  const therapistSlots = useMemo(() => {
    if (!selectedTherapist) {
      return [];
    }

    return (
      AVAILABLE_MASSAGE_SLOTS[
        selectedTherapist as keyof typeof AVAILABLE_MASSAGE_SLOTS
      ] ?? []
    );
  }, [selectedTherapist]);

  // Если сегодня — убираем прошедшие слоты
  const availableSlots = useMemo(() => {
    if (!isToday(selectedDate)) {
      return therapistSlots;
    }

    return therapistSlots.filter((slot) => !isTimeInPast(slot));
  }, [selectedDate, therapistSlots]);

  const canGoToTime = Boolean(selectedTherapist);

  const canGoToProgram = Boolean(
    selectedTherapist && selectedDate && selectedTime,
  );

  const canSubmit = Boolean(
    selectedTherapist &&
    selectedDate &&
    selectedTime &&
    selectedMassage &&
    selectedDuration,
  );

  return (
    <form action={formAction} className="w-full h-full">
      <div className="rounded-2xl bg-white p-5 shadow-sm md:p-8">
        <BookingProgress
          step={step}
          setStep={setStep}
          name={user?.name || user?.email || ""}
        />

        {/* STEP 1 — MASSAGE THERAPIST */}

        {step === 1 && (
          <BookingSelectTherapist
            setStep={setStep}
            selectedTherapist={selectedTherapist}
            setSelectedTherapist={setSelectedTherapist}
            setSelectedTime={setSelectedTime}
            canGoToTime={canGoToTime}
          />
        )}

        {/* STEP 2 — DATE AND TIME */}

        {step === 2 && (
          <BookingSelectDateAndTime
            selectedTime={selectedTime}
            selectedDate={selectedDate}
            setSelectedTime={setSelectedTime}
            setSelectedDate={setSelectedDate}
            setStep={setStep}
            today={getToday()}
            maxDate={maxDate}
            availableSlots={availableSlots}
            canGoToProgram={canGoToProgram}
          />
        )}

        {/* STEP 3 — PROGRAM */}

        {step === 3 && (
          <BookingSelectProgramm
            setStep={setStep}
            setSelectedDuration={setSelectedDuration}
            setSelectedMassage={setSelectedMassage}
            canSubmit={canSubmit}
            selectedMassage={selectedMassage}
            selectedDuration={selectedDuration}
            selectedTherapist={selectedTherapist}
            selectedTime={selectedTime}
            selectedDate={selectedDate}
            buttonText={booking ? "Обновить" : "Записаться"}
          />
        )}
      </div>

      {/* Back */}

      <div className="mt-6 mb-6">
        <Link
          href="/bookings"
          className="text-lg text-gray-500 transition hover:text-gray-900"
        >
          ← Вернуться к бронированиям
        </Link>
      </div>

      {/*Errors shown here*/}
      {/*{state.message && (*/}
      {/*  <p className="mt-4 text-sm text-red-500">{state.message}</p>*/}
      {/*)}*/}
    </form>
  );
}
