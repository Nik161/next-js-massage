import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { cormorant, jost } from "@/app/ui/fonts";
import { INTRO_SKIP_SCRIPT } from "@/app/ui/motion/intro-skip";

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
      // The intro script sets data-intro-seen before hydration
      suppressHydrationWarning
      className={`${jost.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className={`min-h-full flex flex-col `}>
        <Script id="intro-skip" strategy="beforeInteractive">
          {INTRO_SKIP_SCRIPT}
        </Script>
        {/*<Header />*/}
        <div>{children}</div>
      </body>
    </html>
  );
}
