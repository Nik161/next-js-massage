import type { Metadata } from "next";
import "./globals.css";
import { cormorant, jost } from "@/app/ui/fonts";

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
    <html
      data-scroll-behavior="smooth"
      lang="ru"
      className={`${jost.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className={`min-h-full flex flex-col `}>
        {/*<Header />*/}
        <div>{children}</div>
      </body>
    </html>
  );
}
