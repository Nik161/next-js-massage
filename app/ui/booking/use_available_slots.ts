"use client";

import {
  useGetAvailableSlotsQuery,
  type SlotsQuery,
} from "@/app/lib/store/slots_api";

// Loads free slots through the store once therapist, date and duration are chosen.
export function useAvailableSlots(query: SlotsQuery) {
  const isComplete = Boolean(query.therapistId && query.date && query.duration);

  const { currentData, isFetching, isError } = useGetAvailableSlotsQuery(
    query,
    // Other clients book too, so a revisited query is fetched again.
    { skip: !isComplete, refetchOnMountOrArgChange: true },
  );

  return {
    slots: currentData ?? [],
    // Cached slots stay visible while they are refreshed.
    isLoading: isFetching && !currentData,
    isError,
  };
}
