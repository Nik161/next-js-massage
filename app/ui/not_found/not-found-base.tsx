import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { buttonClassName } from "@/app/ui/shared/button";
import { Leaf, PalmFrond } from "@/app/ui/motion/decor";

export default function NotFoundBase({
  backText,
  message,
  url,
}: {
  backText: string;
  message: string;
  url: string;
}) {
  return (
    <div className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden px-4 py-20 text-center">
      <PalmFrond className="pointer-events-none absolute -left-10 bottom-0 h-80 origin-bottom rotate-12 text-gold/20 animate-sway" />
      <Leaf className="pointer-events-none absolute right-[15%] top-10 h-16 text-terracotta/25 animate-float" />
      <span className="animate-fade-up font-display text-[9rem] font-light italic leading-none text-gold">
        404
      </span>
      <div className="mt-2 h-px w-16 animate-fade-in bg-gold/60 [animation-delay:150ms]" />
      <h1 className="mt-6 animate-fade-up font-display text-3xl text-ink [animation-delay:100ms]">
        {message}
      </h1>
      <Link
        href={url}
        className={buttonClassName(
          "primary",
          "mt-8 animate-fade-up [animation-delay:200ms]",
        )}
      >
        <ArrowLeftIcon className="size-4" />
        {backText}
      </Link>
    </div>
  );
}
