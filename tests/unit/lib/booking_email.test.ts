// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const send = vi.hoisted(() => vi.fn());
vi.mock("nodemailer", () => ({
  default: { createTransport: () => ({ sendMail: send }) },
}));

import {
  sendBookingConfirmedEmailToClient,
  sendBookingCreatedEmailToClient,
  sendBookingEmailToTherapist,
  sendBookingUpdatedEmailToClient,
  sendBookingUpdatedEmailToTherapist,
} from "@/app/lib/email/booking_email";

const BOOKING = {
  type: "thai",
  duration: 60,
  date: "2026-10-20",
  time: "14:00",
  clientName: "Anna",
  clientEmail: "anna@example.com",
  therapistName: "Maria",
};

const lastMessage = () => send.mock.calls.at(-1)![0];

beforeEach(() => {
  send.mockReset();
  send.mockResolvedValue({ messageId: "email-1" });
  vi.stubEnv("ADMIN_EMAIL", "admin@example.com");
});

describe("sendBookingEmailToTherapist", () => {
  it("sends the booking and client details to the admin", async () => {
    await sendBookingEmailToTherapist(BOOKING);

    const message = lastMessage();
    expect(message.to).toBe("admin@example.com");
    expect(message.subject).toBe("Новая запись на массаж");
    expect(message.html).toContain("вторник, 20 октября");
    expect(message.html).toContain("14:00");
    expect(message.html).toContain("60 мин.");
    expect(message.html).toContain("Anna");
    expect(message.html).toContain("anna@example.com");
    expect(message.html).toContain("Maria");
  });

  it("leaves out an unknown therapist", async () => {
    await sendBookingEmailToTherapist({ ...BOOKING, therapistName: null });
    expect(lastMessage().html).not.toContain("Массажист");
  });

  it("escapes user-provided values", async () => {
    await sendBookingEmailToTherapist({
      ...BOOKING,
      type: '<img src=x onerror="alert(1)">',
      clientName: "<b>Anna</b>",
    });

    const { html } = lastMessage();
    expect(html).not.toContain("<img");
    expect(html).not.toContain("<b>");
    expect(html).toContain("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;");
  });

  it("fails without an admin address", async () => {
    vi.stubEnv("ADMIN_EMAIL", "");
    await expect(sendBookingEmailToTherapist(BOOKING)).rejects.toThrow(
      "ADMIN_EMAIL is not set",
    );
    expect(send).not.toHaveBeenCalled();
  });

  it("lets SMTP errors through", async () => {
    send.mockRejectedValue(new Error("Invalid login"));
    await expect(sendBookingEmailToTherapist(BOOKING)).rejects.toThrow(
      "Invalid login",
    );
  });
});

describe("booking update emails", () => {
  it("tells the therapist the booking changed", async () => {
    await sendBookingUpdatedEmailToTherapist(BOOKING);

    const message = lastMessage();
    expect(message.to).toBe("admin@example.com");
    expect(message.subject).toBe("Запись на массаж изменена");
    expect(message.html).toContain("anna@example.com");
  });

  it("tells the client the booking changed", async () => {
    await sendBookingUpdatedEmailToClient(BOOKING);

    const message = lastMessage();
    expect(message.to).toBe("anna@example.com");
    expect(message.subject).toBe("Ваша запись изменена");
    expect(message.html).toContain("вторник, 20 октября");
  });
});

describe("sendBookingCreatedEmailToClient", () => {
  it("sends the booking to the client's email", async () => {
    await sendBookingCreatedEmailToClient(BOOKING);

    const message = lastMessage();
    expect(message.to).toBe("anna@example.com");
    expect(message.subject).toBe("Вы записались на массаж");
    expect(message.html).toContain("Maria");
    expect(message.html).toContain("Ожидает подтверждения");
    expect(message.html).toContain("вторник, 20 октября");
  });
});

describe("sendBookingConfirmedEmailToClient", () => {
  it("tells the client the booking is confirmed", async () => {
    await sendBookingConfirmedEmailToClient(BOOKING);

    const message = lastMessage();
    expect(message.to).toBe("anna@example.com");
    expect(message.subject).toBe("Ваша запись подтверждена");
    expect(message.html).toContain("Maria");
    expect(message.html).toContain("Запись подтверждена");
    expect(message.html).toContain("14:00");
  });
});
