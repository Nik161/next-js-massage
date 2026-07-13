import { Metadata } from "next";
import CreateBookingForm from "@/app/ui/booking/create_form";

export const metadata: Metadata = {
  title: "Create Massage Reservation",
};

export default function Page() {
  return (
    <main className="min-w-3/4 flex mx-auto mt-10">
      <CreateBookingForm />
    </main>
  );
}
