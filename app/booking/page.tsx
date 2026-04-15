"use client";

import { useState, useEffect } from "react";
import HeroBooking from "@/app/ui/booking/hero";
import BookingForm from "@/app/ui/booking/booking_form";
import { MASSAGE_TYPES } from "@/app/constants/massage_types";
import BookingSidebar from "@/app/ui/booking/booking_sidebar";
import SubmitModal from "@/app/ui/booking/submit_modal";
import { formatDate } from "@/app/helpers/formatDate";

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedMassage, setSelectedMassage] = useState(MASSAGE_TYPES[0]);
  const [, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleReset = () => {
    setIsSubmitted(false);
    setSelectedMassage(MASSAGE_TYPES[0]);
    setSelectedDate("");
    setSelectedTime("");
  };

  const handleSubmit = (e: FormData) => {
    if (selectedMassage && selectedDate && selectedTime) {
      setIsSubmitted(true);
      console.log("Бронь:", {
        massage: selectedMassage,
        date: selectedDate,
        time: selectedTime,
      });
    }
  };

  // Экран успешной записи
  if (isSubmitted) {
    return (
      <SubmitModal
        handleReset={handleReset}
        isSubmitted={isSubmitted}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        selectedMassage={selectedMassage}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#e8d5bc]">
      <HeroBooking />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
          <BookingForm
            selectedMassage={selectedMassage}
            setSelectedMassage={setSelectedMassage}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            handleSubmit={handleSubmit}
          />

          <BookingSidebar
            selectedMassage={selectedMassage}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
          />
        </div>
      </div>
    </div>
  );
}
