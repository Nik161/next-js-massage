import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import CreateOrEditBookingForm from "@/app/ui/booking/create_or_edit_form";
import { fetchBookingById } from "@/app/lib/data/bookings";
import { getMassageTypes } from "@/app/lib/data/massage_types";
import { getTherapists } from "@/app/lib/data/therapists";
import { requireCurrentUser } from "@/app/lib/session";
import { canEditBooking } from "@/app/lib/permissions";

export const metadata: Metadata = {
  title: "Edit Massage Reservation",
};

export default async function Page(props: PageProps<"/bookings/[id]/edit">) {
  const { id } = await props.params;
  // Checked before the lookup, so non-admins can't probe which booking ids exist.
  const user = await requireCurrentUser();
  if (!canEditBooking(user)) redirect("/bookings");
  // A malformed id can't match any row, and Postgres would reject it as a uuid.
  if (!z.uuid().safeParse(id).success) notFound();

  // Editing is admin only, so the booking is looked up without an owner filter.
  const [booking, therapists, massageTypes] = await Promise.all([
    fetchBookingById(id, null),
    getTherapists(),
    getMassageTypes(),
  ]);
  if (!booking) notFound();

  return (
    <div className="relative z-10 mx-auto -mt-12 w-full max-w-6xl px-4 pb-16">
      <CreateOrEditBookingForm
        userName={user.name || user.email}
        booking={booking}
        therapists={therapists}
        massageTypes={massageTypes}
      />
    </div>
  );
}
