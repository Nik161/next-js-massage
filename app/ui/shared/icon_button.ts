import clsx from "clsx";

// Small bordered square used for row actions (edit, delete, ...).
export function iconButtonClassName(disabled = false) {
  return clsx(
    "rounded-md border p-2",
    disabled
      ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 opacity-60"
      : "hover:bg-gray-100",
  );
}
