import type { Metadata } from "next";
import Header from "@/app/ui/header/header";
import HeroBooking from "@/app/ui/booking/hero";
import { cormorant } from "@/app/ui/fonts";

export const metadata: Metadata = {
  title: "Niko Massage",
  description: "Niko Massage booking site",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full h-screen md:flex-row md:overflow-hidden">
      <Header />
      <HeroBooking />
      <div className={`min-h-full flex flex-col `}>{children}</div>
    </div>
  );
}
