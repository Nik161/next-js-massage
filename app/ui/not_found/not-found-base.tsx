import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { buttonClassName } from "@/app/ui/shared/button";

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
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
      <span className="animate-fade-up font-display text-8xl font-light text-gold">
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
