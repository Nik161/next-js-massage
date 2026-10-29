import nodemailer from "nodemailer";
import { formatLongDate } from "@/app/lib/booking_time";

// Sent through Gmail SMTP; GMAIL_APP_PASSWORD is a Google "app password",
// not the account password (requires 2-Step Verification).
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Gmail rewrites any other address, so only the display name is configurable.
const SENDER = { name: "Niko Massage", address: process.env.GMAIL_USER ?? "" };
const SITE_URL = "https://luxury-massage.vercel.app/bookings";

export type BookingEmailData = {
  type: string;
  duration: number;
  // "YYYY-MM-DD"
  date: string;
  // "HH:MM"
  time: string;
  clientName: string;
  clientEmail: string;
  therapistName: string | null;
};

type EmailContent = {
  subtitle: string;
  label: string;
  details: [label: string, value: string][];
  note: string;
  action: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function detailRow(label: string, value: string) {
  return `
    <div style="padding:10px 0;">
      <div style="font-size:12px; color:#a3a3a3; text-transform:uppercase; letter-spacing:0.8px;">${escapeHtml(label)}</div>
      <div style="margin-top:4px; font-size:16px; font-weight:500;">${escapeHtml(value)}</div>
    </div>
  `;
}

function bookingDetails(booking: BookingEmailData): [string, string][] {
  return [
    ...(booking.therapistName
      ? [["Массажист", booking.therapistName] as [string, string]]
      : []),
    ["Массаж", booking.type],
    ["Продолжительность", `${booking.duration} мин.`],
  ];
}

function renderBookingEmail(booking: BookingEmailData, content: EmailContent) {
  const date = escapeHtml(formatLongDate(booking.date));
  const time = escapeHtml(booking.time);

  return `
    <div style="margin:0; padding:40px 20px; background:#f5f5f4; font-family:Arial,Helvetica,sans-serif; color:#171717;">
      <div style="max-width:600px; margin:0 auto;">
        <!-- Header -->
        <div style="text-align:center; margin-bottom:24px;">
          <div style="font-size:28px; font-weight:600; letter-spacing:0.5px;">Niko Massage</div>
          <div style="margin-top:8px; font-size:14px; color:#737373;">${escapeHtml(content.subtitle)}</div>
        </div>

        <!-- Main card -->
        <div style="background:#ffffff; border-radius:20px; padding:32px; box-shadow:0 4px 20px rgba(0,0,0,0.06);">
          <div style="text-align:center; margin-bottom:28px;">
            <div style="font-size:13px; color:#737373; text-transform:uppercase; letter-spacing:1px;">${escapeHtml(content.label)}</div>
            <div style="margin-top:10px; font-size:28px; font-weight:600;">${date}</div>
            <div style="margin-top:6px; font-size:18px; color:#525252;">${time}</div>
          </div>

          <!-- Details -->
          <div style="border-top:1px solid #e5e5e5; border-bottom:1px solid #e5e5e5; padding:20px 0;">
            ${content.details.map(([label, value]) => detailRow(label, value)).join("")}
          </div>

          <!-- Action -->
          <div style="text-align:center; margin-top:28px;">
            <div style="margin-bottom:16px; font-size:14px; line-height:1.5; color:#737373;">
              ${escapeHtml(content.note)}
            </div>
            <a href="${SITE_URL}" target="_blank" style="display:inline-block; padding:14px 28px; border-radius:12px; background:#171717; color:#ffffff; font-size:15px; font-weight:600; text-decoration:none;">
              ${escapeHtml(content.action)}
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="padding:24px 10px; text-align:center; font-size:12px; line-height:1.5; color:#a3a3a3;">
          Это автоматическое уведомление от Niko Massage.<br />
          Пожалуйста, не отвечайте на это письмо.
        </div>
      </div>
    </div>
  `;
}

async function sendEmail(to: string, subject: string, html: string) {
  return transporter.sendMail({ from: SENDER, to, subject, html });
}

function sendToTherapist(
  subject: string,
  booking: BookingEmailData,
  content: Pick<EmailContent, "label" | "note" | "action">,
) {
  const to = process.env.ADMIN_EMAIL;
  if (!to) throw new Error("ADMIN_EMAIL is not set");

  return sendEmail(
    to,
    subject,
    renderBookingEmail(booking, {
      subtitle: subject,
      details: [
        ["Клиент", booking.clientName],
        ["Email клиента", booking.clientEmail],
        ...bookingDetails(booking),
      ],
      ...content,
    }),
  );
}

export async function sendBookingEmailToTherapist(booking: BookingEmailData) {
  return sendToTherapist("Новая запись на массаж", booking, {
    label: "Новая запись",
    note: "Проверьте данные записи и подтвердите её на сайте.",
    action: "Подтвердить запись",
  });
}

export async function sendBookingUpdatedEmailToTherapist(
  booking: BookingEmailData,
) {
  return sendToTherapist("Запись на массаж изменена", booking, {
    label: "Запись изменена",
    note: "Проверьте новые данные записи на сайте.",
    action: "Открыть записи",
  });
}

export async function sendBookingCreatedEmailToClient(
  booking: BookingEmailData,
) {
  return sendEmail(
    booking.clientEmail,
    "Вы записались на массаж",
    renderBookingEmail(booking, {
      subtitle: `${booking.clientName}, спасибо за запись!`,
      label: "Ожидает подтверждения",
      details: bookingDetails(booking),
      note: "Мы пришлём ещё одно письмо, когда массажист подтвердит запись.",
      action: "Мои записи",
    }),
  );
}

export async function sendBookingUpdatedEmailToClient(
  booking: BookingEmailData,
) {
  return sendEmail(
    booking.clientEmail,
    "Ваша запись изменена",
    renderBookingEmail(booking, {
      subtitle: `${booking.clientName}, ваша запись изменена`,
      label: "Запись изменена",
      details: bookingDetails(booking),
      note: "Проверьте новые дату, время и программу массажа.",
      action: "Мои записи",
    }),
  );
}

export async function sendBookingConfirmedEmailToClient(
  booking: BookingEmailData,
) {
  return sendEmail(
    booking.clientEmail,
    "Ваша запись подтверждена",
    renderBookingEmail(booking, {
      subtitle: `${booking.clientName}, ваша запись подтверждена`,
      label: "Запись подтверждена",
      details: bookingDetails(booking),
      note: "Ждём вас в назначенное время.",
      action: "Мои записи",
    }),
  );
}
