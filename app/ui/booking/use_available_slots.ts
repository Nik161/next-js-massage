"use client";

import { useEffect, useState } from "react";

type SlotsResult = { key: string; slots: string[]; isError: boolean };

// Loads free slots from /api/massage_slots whenever the query changes.
export function useAvailableSlots({
  therapistId,
  date,
  duration,
  excludeBookingId,
}: {
  therapistId: string;
  date: string;
  duration: number;
  excludeBookingId?: string;
}) {
  const isComplete = Boolean(therapistId && date && duration);

  const params = new URLSearchParams({
    therapistId,
    date,
    duration: String(duration),
  });
  if (excludeBookingId) params.set("excludeBookingId", excludeBookingId);
  const key = params.toString();

  const [result, setResult] = useState<SlotsResult | null>(null);

  useEffect(() => {
    if (!isComplete) return;

    const controller = new AbortController();

    fetch(`/api/massage_slots?${key}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<{ slots: string[] }>;
      })
      .then(({ slots }) => setResult({ key, slots, isError: false }))
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.error("Failed to load slots:", error);
        setResult({ key, slots: [], isError: true });
      });

    return () => controller.abort();
  }, [key, isComplete]);

  // A result for an older query means the current one is still loading.
  const isCurrent = result?.key === key;

  return {
    slots: isCurrent ? result.slots : [],
    isLoading: isComplete && !isCurrent,
    isError: isCurrent && result.isError,
  };
}
