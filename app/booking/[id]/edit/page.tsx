// import { fetchCustomers, fetchInvoiceById } from "@/app/lib/data";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import HeroBooking from "@/app/ui/booking/hero";

export const metadata: Metadata = {
  title: "Edit Invoice",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  console.log("id", id);
  // const [invoice, customers] = await Promise.all([
  //   fetchInvoiceById(id),
  //   fetchCustomers(),
  // ]);

  // if (!invoice) {
  notFound();
  // }

  return (
    <main>
      <HeroBooking />
      EDIT PAGE
      {/*<Form invoice={invoice} customers={customers} />*/}
    </main>
  );
}
