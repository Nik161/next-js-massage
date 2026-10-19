import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import LoginForm from "@/app/ui/login/login_form";
import MassageName from "@/app/ui/shared/massage_name";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="absolute inset-0 animate-slowzoom bg-[url('/images/main_hero.jpeg')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-linear-to-br from-forest/90 via-forest/75 to-terracotta/40" />

      <div className="relative z-10 w-full max-w-md">
        <Link
          href="/"
          className="mb-8 flex animate-fade-up justify-center font-display text-3xl font-semibold tracking-[0.05em] text-cream"
        >
          <MassageName />
        </Link>

        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
