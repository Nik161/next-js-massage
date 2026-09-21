import { Metadata } from "next";
import CreateBookingForm from "@/app/ui/booking/create_or_edit_form";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Create Massage Reservation",
};

export default async function Page() {
  const session = await auth();
  return (
    <main className="min-w-3/4 flex mx-auto mt-10">
      <CreateBookingForm user={session?.user} booking={undefined} />
    </main>
  );
}
