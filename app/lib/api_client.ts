import type { ApiErrorBody } from "@/app/lib/api/http";
import type { BookingInput } from "@/app/lib/bookings";
import type {
  BookingResponse,
  ManualBookingStatus,
} from "@/app/lib/definitions";

// Browser-side calls to our own REST API; the session cookie authenticates them.

export class ApiRequestError extends Error {
  constructor(
    public status: number,
    public body: ApiErrorBody,
  ) {
    super(body.error);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
  });

  if (!response.ok) {
    const body = await response
      .json()
      .catch(() => ({ error: `HTTP ${response.status}` }));
    throw new ApiRequestError(response.status, body);
  }

  return (response.status === 204 ? undefined : response.json()) as T;
}

export function createBooking(input: BookingInput) {
  return request<{ booking: BookingResponse }>("/api/bookings", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateBooking(id: string, input: BookingInput) {
  return request<{ booking: BookingResponse }>(`/api/bookings/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function deleteBooking(id: string) {
  return request<void>(`/api/bookings/${id}`, { method: "DELETE" });
}

export function setBookingStatus(id: string, status: ManualBookingStatus) {
  return request<void>(`/api/bookings/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
