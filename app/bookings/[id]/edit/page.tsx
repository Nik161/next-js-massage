import { notFound } from "next/navigation";
import { Metadata } from "next";
import { fetchBookingById } from "@/app/lib/data/bookings";
import CreateOrEditBookingForm from "@/app/ui/booking/create_or_edit_form";
import { auth } from "@/auth";
import { getMassageTypes } from "@/app/lib/data/massage_types";

export const metadata: Metadata = {
  title: "Edit Massage Reservation",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const booking = await fetchBookingById(id);
  const session = await auth();
  const massageTypes = await getMassageTypes();
  if (!booking) {
    notFound();
  }

  return (
    <main className="min-w-3/4 flex mx-auto mt-10">
      <CreateOrEditBookingForm
        user={session?.user}
        booking={booking}
        massageTypes={massageTypes}
      />
    </main>
  );
}
