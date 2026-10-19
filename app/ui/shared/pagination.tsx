"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { generatePagination } from "@/app/lib/pagination";
import { usePathname, useSearchParams } from "next/navigation";

const ITEM_CLASS =
  "flex size-10 items-center justify-center rounded-full text-sm font-medium transition-all duration-200";

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const allPages = generatePagination(currentPage, totalPages);

  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <nav
      aria-label="Страницы"
      className="inline-flex items-center gap-1 rounded-full border border-line bg-white p-1 shadow-soft"
    >
      <PaginationArrow
        direction="left"
        href={createPageURL(currentPage - 1)}
        isDisabled={currentPage <= 1}
      />

      {allPages.map((page, index) => (
        <PaginationNumber
          key={`${page}-${index}`}
          href={createPageURL(page)}
          page={page}
          isActive={currentPage === page}
        />
      ))}

      <PaginationArrow
        direction="right"
        href={createPageURL(currentPage + 1)}
        isDisabled={currentPage >= totalPages}
      />
    </nav>
  );
}

function PaginationNumber({
  page,
  href,
  isActive,
}: {
  page: number | string;
  href: string;
  isActive: boolean;
}) {
  if (page === "...") {
    return <span className={clsx(ITEM_CLASS, "text-muted")}>…</span>;
  }

  if (isActive) {
    return (
      <span
        aria-current="page"
        className={clsx(ITEM_CLASS, "animate-pop bg-forest text-cream")}
      >
        {page}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={clsx(ITEM_CLASS, "text-ink hover:bg-sage hover:text-forest")}
    >
      {page}
    </Link>
  );
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: "left" | "right";
  isDisabled?: boolean;
}) {
  const icon =
    direction === "left" ? (
      <ArrowLeftIcon className="size-4" />
    ) : (
      <ArrowRightIcon className="size-4" />
    );
  const label = direction === "left" ? "Предыдущая" : "Следующая";

  return isDisabled ? (
    <span className={clsx(ITEM_CLASS, "text-muted/30")}>{icon}</span>
  ) : (
    <Link
      href={href}
      aria-label={label}
      className={clsx(ITEM_CLASS, "text-ink hover:bg-sage hover:text-forest")}
    >
      {icon}
    </Link>
  );
}
