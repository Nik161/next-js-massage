"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Spinner from "@/app/ui/shared/spinner";

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    startTransition(() => replace(`${pathname}?${params.toString()}`));
  }, 400);

  return (
    <div className="relative flex flex-1 shrink-0">
      <label htmlFor="search" className="sr-only">
        Поиск
      </label>
      <input
        id="search"
        type="search"
        onChange={(e) => handleSearch(e.target.value)}
        className="peer block h-12 w-full rounded-full border border-line bg-white pl-12 pr-11 text-[0.95rem] text-ink shadow-soft outline-none transition-all duration-300 placeholder:text-muted/70 focus:border-gold focus:ring-4 focus:ring-gold/15"
        placeholder={placeholder}
        defaultValue={searchParams.get("query")?.toString()}
      />
      <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted transition-colors peer-focus:text-gold-dark" />
      {isPending && (
        <Spinner className="absolute right-4 top-1/2 -mt-2 text-gold-dark" />
      )}
    </div>
  );
}
