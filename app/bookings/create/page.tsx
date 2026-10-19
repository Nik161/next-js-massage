import type { Metadata } from "next";
import CreateOrEditBookingForm from "@/app/ui/booking/create_or_edit_form";
import { getMassageTypes } from "@/app/lib/data/massage_types";
import { getTherapists } from "@/app/lib/data/therapists";
import { getCurrentUser } from "@/app/lib/session";

export const metadata: Metadata = {
  title: "Create Massage Reservation",
};

export default async function Page(props: PageProps<"/bookings/create">) {
  const { therapist } = await props.searchParams;
  const [user, therapists, massageTypes] = await Promise.all([
    getCurrentUser(),
    getTherapists(),
    getMassageTypes(),
  ]);

  return (
    <div className="relative z-10 mx-auto -mt-12 w-full max-w-6xl px-4 pb-16">
      <CreateOrEditBookingForm
        userName={user?.name || user?.email || ""}
        therapists={therapists}
        // Preselected from "Записаться к мастеру" on the landing page
        initialTherapistId={therapists.find((t) => t.id === therapist)?.id}
        massageTypes={massageTypes}
      />
    </div>
  );
}
