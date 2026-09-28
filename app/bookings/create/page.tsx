import { Metadata } from "next";
import CreateBookingForm from "@/app/ui/booking/create_or_edit_form";
import { auth } from "@/auth";
import { getMassageTypes } from "@/app/lib/data/massage_types";

export const metadata: Metadata = {
  title: "Create Massage Reservation",
};

export default async function Page() {
  const session = await auth();
  const massageTypes = await getMassageTypes();
  return (
    <main className="min-w-3/4 flex mx-auto mt-10">
      <CreateBookingForm
        user={session?.user}
        booking={undefined}
        massageTypes={massageTypes}
      />
    </main>
  );
}
