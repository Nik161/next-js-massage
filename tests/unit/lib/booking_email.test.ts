// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

const send = vi.hoisted(() => vi.fn().mockResolvedValue({ id: "email-1" }));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

import { sendBookingEmailToTherapist } from "@/app/lib/email/booking_email";

describe("sendBookingEmailToTherapist", () => {
  it("sends the booking details to the admin", async () => {
    vi.stubEnv("ADMIN_EMAIL", "admin@example.com");

    await sendBookingEmailToTherapist({
      type: "thai",
      duration: 60,
      date: "2026-10-20",
      time: "14:00",
    });

    const message = send.mock.calls[0][0];
    expect(message.to).toBe("admin@example.com");
    expect(message.subject).toBe("Новая запись на массаж");
    expect(message.html).toContain("2026-10-20");
    expect(message.html).toContain("14:00");
    expect(message.html).toContain("60 мин.");
  });

  it("escapes user-provided values", async () => {
    await sendBookingEmailToTherapist({
      type: '<img src=x onerror="alert(1)">',
      duration: 30,
      date: "2026-10-20",
      time: "14:00",
    });

    const { html } = send.mock.calls.at(-1)![0];
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;");
  });
});
