import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import LoginForm from "@/app/ui/login/login_form";
import MassageName from "@/app/ui/shared/massage_name";
import { GoldDust, Leaf, PalmFrond } from "@/app/ui/motion/decor";
import PointerParallax from "@/app/ui/motion/pointer_parallax";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <main className="grain relative grid min-h-screen overflow-hidden bg-forest lg:grid-cols-2">
      {/* Photo side (desktop) */}
      <div className="relative hidden overflow-hidden lg:block">
        <Image
          src="/images/main_hero.jpeg"
          alt=""
          fill
          preload
          sizes="50vw"
          className="animate-slowzoom object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-forest/30 to-forest" />
        <div className="absolute bottom-16 left-16 max-w-sm animate-fade-up text-cream [animation-delay:300ms]">
          <p className="font-display text-5xl font-light leading-tight">
            Ваше время <em className="italic text-gold">покоя</em> ждёт
          </p>
          <div className="mt-6 h-px w-16 bg-gold" />
        </div>
      </div>

      {/* Form side */}
      <div className="relative flex items-center justify-center px-4 py-16">
        <PointerParallax
          depth={16}
          className="pointer-events-none absolute inset-0"
        >
          <PalmFrond className="absolute -right-24 -top-20 h-[460px] origin-bottom rotate-[200deg] text-gold/15 animate-sway" />
          <Leaf className="absolute bottom-16 left-10 h-20 text-gold/20 animate-float" />
        </PointerParallax>
        <GoldDust />

        <div className="relative z-10 w-full max-w-md">
          <Link
            href="/"
            className="mb-10 flex animate-fade-up justify-center font-display text-4xl font-medium tracking-[0.04em] text-cream"
          >
            <MassageName />
          </Link>

          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
