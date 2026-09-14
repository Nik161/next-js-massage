import type { Metadata } from "next";
import Header from "@/app/ui/header/header";
import HeroBooking from "@/app/ui/booking/hero";

export const metadata: Metadata = {
  title: "Niko Massage",
  description: "Niko Massage bookings site",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full">
      <Header />
      <HeroBooking />

      <main className="w-full">{children}</main>
    </div>
  );
}
