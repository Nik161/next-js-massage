import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const SENDER = "onboarding@resend.dev";
const SITE_URL = "https://luxury-massage.vercel.app/";

export type BookingEmailData = {
  type: string;
  duration: number;
  date: string;
  time: string;
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
      <div style="font-size:12px; color:#a3a3a3; text-transform:uppercase; letter-spacing:0.8px;">${label}</div>
      <div style="margin-top:4px; font-size:16px; font-weight:500;">${value}</div>
    </div>
  `;
}

function renderBookingEmail(booking: BookingEmailData) {
  const date = escapeHtml(booking.date);
  const time = escapeHtml(booking.time);
  const type = escapeHtml(booking.type);

  return `
    <div style="margin:0; padding:40px 20px; background:#f5f5f4; font-family:Arial,Helvetica,sans-serif; color:#171717;">
      <div style="max-width:600px; margin:0 auto;">
        <!-- Header -->
        <div style="text-align:center; margin-bottom:24px;">
          <div style="font-size:28px; font-weight:600; letter-spacing:0.5px;">Niko Massage</div>
          <div style="margin-top:8px; font-size:14px; color:#737373;">Новая запись на массаж</div>
        </div>

        <!-- Main card -->
        <div style="background:#ffffff; border-radius:20px; padding:32px; box-shadow:0 4px 20px rgba(0,0,0,0.06);">
          <div style="text-align:center; margin-bottom:28px;">
            <div style="font-size:13px; color:#737373; text-transform:uppercase; letter-spacing:1px;">Новая запись</div>
            <div style="margin-top:10px; font-size:28px; font-weight:600;">${date}</div>
            <div style="margin-top:6px; font-size:18px; color:#525252;">${time}</div>
          </div>

          <!-- Details -->
          <div style="border-top:1px solid #e5e5e5; border-bottom:1px solid #e5e5e5; padding:20px 0;">
            ${detailRow("Массаж", type)}
            ${detailRow("Продолжительность", `${booking.duration} мин.`)}
          </div>

          <!-- Action -->
          <div style="text-align:center; margin-top:28px;">
            <div style="margin-bottom:16px; font-size:14px; line-height:1.5; color:#737373;">
              Проверьте данные записи и подтвердите её на сайте.
            </div>
            <a href="${SITE_URL}" target="_blank" style="display:inline-block; padding:14px 28px; border-radius:12px; background:#171717; color:#ffffff; font-size:15px; font-weight:600; text-decoration:none;">
              Подтвердить запись
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

export async function sendBookingEmailToTherapist(booking: BookingEmailData) {
  return resend.emails.send({
    from: SENDER,
    to: process.env.ADMIN_EMAIL!,
    subject: "Новая запись на массаж",
    html: renderBookingEmail(booking),
  });
}
