import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import CreateOrEditBookingForm from "@/app/ui/booking/create_or_edit_form";
import { fetchBookingById } from "@/app/lib/data/bookings";
import { getMassageTypes } from "@/app/lib/data/massage_types";
import { getTherapists } from "@/app/lib/data/therapists";
import { getCurrentUser } from "@/app/lib/session";
import { canEditBooking } from "@/app/lib/permissions";

export const metadata: Metadata = {
  title: "Edit Massage Reservation",
};

export default async function Page(props: PageProps<"/bookings/[id]/edit">) {
  const { id } = await props.params;
  // Editing is admin only, so the booking is looked up without an owner filter.
  const [booking, user, therapists, massageTypes] = await Promise.all([
    fetchBookingById(id, null),
    getCurrentUser(),
    getTherapists(),
    getMassageTypes(),
  ]);

  if (!booking) notFound();
  if (!canEditBooking(user)) redirect("/bookings");

  return (
    <div className="relative z-10 mx-auto -mt-12 w-full max-w-6xl px-4 pb-16">
      <CreateOrEditBookingForm
        userName={user?.name || user?.email || ""}
        booking={booking}
        therapists={therapists}
        massageTypes={massageTypes}
      />
    </div>
  );
}
