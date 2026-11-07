"use client";

import { useEffect, useRef } from "react";
import { cormorant } from "@/app/ui/fonts";
import { INTRO_STORAGE_KEY } from "@/app/ui/motion/intro-skip";
import {
  useAppDispatch,
  useAppSelector,
  useAppStore,
} from "@/app/lib/store/hooks";
import {
  introHidden,
  introStarted,
  selectIsIntroShown,
} from "@/app/lib/store/ui_slice";

const INTRO_MS = 2600;

const LETTERS = "Niko·Massage".split("");

// Opening curtain with the logo; it slides away and reveals the page.
export default function Intro() {
  const store = useAppStore();
  const dispatch = useAppDispatch();

  // Back on the landing page after leaving mid-curtain: don't play it again.
  // Runs before the first read, and Intro renders before anything else.
  const isChecked = useRef<true | null>(null);
  if (isChecked.current == null) {
    if (store.getState().ui.hasIntroPlayed) store.dispatch(introHidden());
    isChecked.current = true;
  }

  const isShown = useAppSelector(selectIsIntroShown);

  useEffect(() => {
    if (!isShown) return;
    dispatch(introStarted());

    const root = document.documentElement;
    const skipped = root.dataset.introSeen !== undefined;
    try {
      sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
    } catch {}

    if (skipped) return;
    root.style.overflow = "hidden";
    const timer = setTimeout(() => dispatch(introHidden()), INTRO_MS);
    return () => {
      clearTimeout(timer);
      root.style.overflow = "";
    };
  }, [isShown, dispatch]);

  if (!isShown) return null;

  return (
    <div
      aria-hidden="true"
      onClick={() => dispatch(introHidden())}
      className="intro grain fixed inset-0 z-[100] flex flex-col items-center justify-center bg-forest text-cream"
    >
      <div
        className={`${cormorant.className} flex overflow-hidden text-5xl font-light tracking-[0.04em] md:text-7xl`}
      >
        {LETTERS.map((letter, i) => (
          <span
            key={i}
            className={letter === "·" ? "text-gold" : undefined}
            style={{
              display: "inline-block",
              animation: `fade-up 0.9s cubic-bezier(0.16,1,0.3,1) ${150 + i * 45}ms both`,
            }}
          >
            {letter}
          </span>
        ))}
      </div>
      <div
        className="mt-6 h-px w-40 origin-center bg-gold"
        style={{
          animation: "intro-line 1s cubic-bezier(0.16,1,0.3,1) 500ms both",
        }}
      />
      <p
        className="mt-5 text-[0.7rem] uppercase tracking-[0.5em] text-gold/80"
        style={{ animation: "fade-in 0.8s ease-out 800ms both" }}
      >
        Ритуалы Бали
      </p>
    </div>
  );
}
