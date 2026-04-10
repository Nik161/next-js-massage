import type { Metadata } from "next";
import "./globals.css";
import { Cormorant_Garamond } from "next/font/google";
import Header from "@/app/ui/header/header";
import Footer from "@/app/ui/footer/footer";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  style: "italic",
  weight: ["300", "400", "600"],
});

export const metadata: Metadata = {
  title: "Social Massage",
  description: "Social Massage booking site",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <div>{children}</div>
        <Footer />
      </body>
    </html>
  );
}
