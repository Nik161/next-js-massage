import Link from "next/link";
import { FaceFrownIcon } from "@heroicons/react/24/outline";

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
    <main className="flex flex-col items-center justify-center gap-2 mt-5">
      <FaceFrownIcon className="w-10 text-gray-400" />
      <h1 className="text-xl">{message}</h1>
      <Link
        href={url}
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-xl text-white transition-colors hover:bg-blue-400"
      >
        {backText}
      </Link>
    </main>
  );
}
