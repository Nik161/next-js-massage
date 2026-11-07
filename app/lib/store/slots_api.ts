import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export type SlotsQuery = {
  therapistId: string;
  date: string;
  duration: number;
  excludeBookingId?: string;
};

export function slotsQueryString({
  therapistId,
  date,
  duration,
  excludeBookingId,
}: SlotsQuery) {
  const params = new URLSearchParams({
    therapistId,
    date,
    duration: String(duration),
  });
  if (excludeBookingId) params.set("excludeBookingId", excludeBookingId);
  return params.toString();
}

// Free slots from /api/massage_slots, cached per query in the store.
export const slotsApi = createApi({
  reducerPath: "slotsApi",
  baseQuery: fakeBaseQuery<string>(),
  endpoints: (build) => ({
    getAvailableSlots: build.query<string[], SlotsQuery>({
      async queryFn(query, { signal }) {
        try {
          const response = await fetch(
            `/api/massage_slots?${slotsQueryString(query)}`,
            { signal },
          );
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const { slots } = (await response.json()) as { slots: string[] };
          return { data: slots };
        } catch (error) {
          if (!signal.aborted) console.error("Failed to load slots:", error);
          return { error: String(error) };
        }
      },
    }),
  }),
});

export const { useGetAvailableSlotsQuery } = slotsApi;
