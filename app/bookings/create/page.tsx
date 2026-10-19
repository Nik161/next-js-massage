import type { Metadata } from "next";
import CreateOrEditBookingForm from "@/app/ui/booking/create_or_edit_form";
import { getMassageTypes } from "@/app/lib/data/massage_types";
import { getTherapists } from "@/app/lib/data/therapists";
import { getCurrentUser } from "@/app/lib/session";

export const metadata: Metadata = {
  title: "Create Massage Reservation",
};

export default async function Page() {
  const [user, therapists, massageTypes] = await Promise.all([
    getCurrentUser(),
    getTherapists(),
    getMassageTypes(),
  ]);

  return (
    <div className="mx-auto mt-10 flex min-w-3/4">
      <CreateOrEditBookingForm
        userName={user?.name || user?.email || ""}
        therapists={therapists}
        massageTypes={massageTypes}
      />
    </div>
  );
}
