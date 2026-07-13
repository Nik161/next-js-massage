import { notFound } from "next/navigation";
import { Metadata } from "next";
import EditBookingForm from "@/app/ui/booking/edit_form";
import { fetchBookingById } from "@/app/lib/data";

export const metadata: Metadata = {
  title: "Edit Massage Reservation",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const booking = await fetchBookingById(id);
  // const [invoice, customers] = await Promise.all([
  //   fetchInvoiceById(id),
  //   fetchCustomers(),
  // ]);
  //
  if (!booking) {
    notFound();
  }

  return (
    <main className="min-w-3/4 flex mx-auto mt-10">
      <EditBookingForm booking={booking} />
    </main>
  );
}
