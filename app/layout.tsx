import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="h-full antialiased">
      <body className={`min-h-full flex flex-col `}>
        {/*<Header />*/}
        <div>{children}</div>
      </body>
    </html>
  );
}
