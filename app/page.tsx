"use client";
import Strip from "@/app/ui/main_page/strip";
import Hero from "@/app/ui/main_page/hero";
import About from "@/app/ui/main_page/about";
import Services from "@/app/ui/main_page/services";
import Gallery from "@/app/ui/main_page/gallery";
import Banner from "@/app/ui/main_page/banner";

export default function HomePage() {
  return (
    <div className="bg-[#f5ede0] text-[#2a1f14] overflow-x-hidden font-['Jost',sans-serif]">
      <Hero />
      {/*<Strip />*/}
      {/*<About />*/}
      {/*<Services />*/}
      {/*<Gallery />*/}
      {/*<Banner />*/}
    </div>
  );
}
