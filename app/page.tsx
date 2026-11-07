import Header from "@/app/ui/header/header";
import Footer from "@/app/ui/footer/footer";
import Intro from "@/app/ui/motion/intro";
import ScrollProgress from "@/app/ui/motion/scroll_progress";
import Hero from "@/app/ui/main_page/hero";
import Strip from "@/app/ui/main_page/strip";
import About from "@/app/ui/main_page/about";
import Services from "@/app/ui/main_page/services";
import Philosophy from "@/app/ui/main_page/philosophy";
import Process from "@/app/ui/main_page/process";
import Masters from "@/app/ui/main_page/masters";
import Gallery from "@/app/ui/main_page/gallery";
import Banner from "@/app/ui/main_page/banner";

export default function HomePage() {
  return (
    <>
      {/* Must stay first: siblings after it wait for the curtain (globals.css) */}
      <Intro />
      <div className="overflow-x-clip bg-cream text-bark">
        <ScrollProgress />
        <Header />
        <main>
          <Hero />
          <Strip />
          <About />
          <Services />
          <Philosophy />
          <Process />
          <Masters />
          <Gallery />
          <Banner />
        </main>
        <Footer />
      </div>
    </>
  );
}
