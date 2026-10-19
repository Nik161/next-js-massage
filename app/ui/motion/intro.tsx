"use client";

import { useEffect, useState } from "react";
import { cormorant } from "@/app/ui/fonts";

const STORAGE_KEY = "intro-seen";
const INTRO_MS = 2600;

// Runs before paint: hides the curtain on repeat visits in this session.
const SKIP_SCRIPT = `try{if(sessionStorage.getItem("${STORAGE_KEY}"))document.documentElement.dataset.introSeen=""}catch(e){}`;

// Survives client-side navigation, so the curtain only plays on a full load.
let hasPlayed = false;

const LETTERS = "Niko·Massage".split("");

// Opening curtain with the logo; it slides away and reveals the page.
export default function Intro() {
  const [isShown, setIsShown] = useState(() => !hasPlayed);

  useEffect(() => {
    if (!isShown) return;
    hasPlayed = true;

    const root = document.documentElement;
    const skipped = root.dataset.introSeen !== undefined;
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {}

    if (skipped) return;
    root.style.overflow = "hidden";
    const timer = setTimeout(() => setIsShown(false), INTRO_MS);
    return () => {
      clearTimeout(timer);
      root.style.overflow = "";
    };
  }, [isShown]);

  if (!isShown) return null;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SKIP_SCRIPT }} />
      <div
        aria-hidden="true"
        onClick={() => setIsShown(false)}
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
    </>
  );
}
