import "server-only";
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;
const FROM = process.env.EMAIL_FROM ?? "Bharat Global Education <onboarding@resend.dev>";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

async function send(to: string, subject: string, html: string, replyTo?: string) {
  if (!resend) {
    console.info(`[email:dev] to=${to} subject="${subject}" (set RESEND_API_KEY to send)`);
    return;
  }
  const { error } = await resend.emails.send({ from: FROM, to, subject, html, replyTo });
  if (error) console.error("[email] Resend error:", error);
}

const shell = (body: string) => `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
  <div style="background:#0b2350;color:#fff;padding:18px 24px;font-weight:700;font-size:18px">
    Bharat Global Education <span style="color:#f97316;font-weight:400;font-size:12px;display:block">Your Dream | Our Commitment</span>
  </div>
  <div style="padding:24px;color:#111827;font-size:14px;line-height:1.6">${body}</div>
</div>`;

export type LeadEmailInput = {
  name: string;
  phone: string;
  email?: string | null;
  qualification?: string | null;
  course?: string | null;
  location?: string | null;
  source: string;
  universityName?: string | null;
};

export async function sendLeadNotification(to: string, lead: LeadEmailInput) {
  const rows: [string, string | null | undefined][] = [
    ["Name", lead.name],
    ["Mobile / WhatsApp", lead.phone],
    ["Email", lead.email],
    ["Qualification", lead.qualification],
    ["Preferred Course", lead.course],
    ["State / City", lead.location],
    ["University", lead.universityName],
    ["Source", lead.source],
  ];
  const table = rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#6b7280">${k}</td><td style="padding:6px 0;font-weight:600">${esc(v!)}</td></tr>`)
    .join("");
  await send(
    to,
    `New lead: ${lead.name}${lead.universityName ? ` – ${lead.universityName}` : ""}`,
    shell(`<p style="margin-top:0">A new enquiry just came in from the website.</p><table>${table}</table>`),
    lead.email ?? undefined,
  );
}

export async function sendLeadConfirmation(lead: LeadEmailInput, helpline: string) {
  if (!lead.email) return;
  const what = lead.universityName ? `the <b>${esc(lead.universityName)}</b> brochure` : "free career counselling";
  await send(
    lead.email,
    "We've received your request – Bharat Global Education",
    shell(`
      <p style="margin-top:0">Hi ${esc(lead.name)},</p>
      <p>Thank you for requesting ${what}. One of our senior admission counsellors will call you on <b>${esc(lead.phone)}</b> shortly.</p>
      <p>Need help sooner? Call our student helpline at <b>${esc(helpline)}</b>.</p>
      <p style="color:#6b7280;font-size:12px">You received this email because you submitted a form on our website. Your details are 100% safe and never spammed.</p>`),
  );
}
