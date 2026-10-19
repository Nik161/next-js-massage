import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useAvailableSlots } from "@/app/ui/booking/use_available_slots";

const QUERY = { therapistId: "t-1", date: "2026-10-20", duration: 60 };

function jsonResponse(body: unknown, status = 200) {
  return Promise.resolve(
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    }),
  );
}

describe("useAvailableSlots", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads slots for a complete query", async () => {
    fetchMock.mockReturnValue(jsonResponse({ slots: ["09:00", "10:00"] }));

    const { result } = renderHook(() => useAvailableSlots(QUERY));

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.slots).toEqual(["09:00", "10:00"]);
    expect(result.current.isError).toBe(false);
    expect(fetchMock.mock.calls[0][0]).toBe(
      "/api/massage_slots?therapistId=t-1&date=2026-10-20&duration=60",
    );
  });

  it("includes the booking being edited", async () => {
    fetchMock.mockReturnValue(jsonResponse({ slots: [] }));
    renderHook(() => useAvailableSlots({ ...QUERY, excludeBookingId: "b-1" }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(fetchMock.mock.calls[0][0]).toContain("excludeBookingId=b-1");
  });

  it("does not fetch until therapist, date and duration are chosen", () => {
    const { result } = renderHook(() =>
      useAvailableSlots({ ...QUERY, duration: 0 }),
    );
    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.current).toEqual({
      slots: [],
      isLoading: false,
      isError: false,
    });
  });

  it("reports server errors", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    fetchMock.mockReturnValue(jsonResponse({ error: "x" }, 500));

    const { result } = renderHook(() => useAvailableSlots(QUERY));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.slots).toEqual([]);
  });

  it("aborts the previous request when the query changes", async () => {
    fetchMock.mockReturnValue(new Promise(() => {}));
    const { rerender } = renderHook((query) => useAvailableSlots(query), {
      initialProps: QUERY,
    });

    const firstSignal: AbortSignal = fetchMock.mock.calls[0][1].signal;
    rerender({ ...QUERY, date: "2026-10-21" });

    expect(firstSignal.aborted).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
