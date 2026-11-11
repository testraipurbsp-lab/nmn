import nodemailer from "nodemailer";
import type { ContactInput } from "./contact-schema";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

export function emailConfig() {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  const to = process.env.CONTACT_TO_EMAIL?.trim() || user;
  if (!user || !pass || !to) return null;
  return { user, pass, to };
}

export async function sendInquiry(input: ContactInput) {
  const cfg = emailConfig();
  if (!cfg) throw new Error("EMAIL_NOT_CONFIGURED");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: cfg.user, pass: cfg.pass },
  });
  const rows: [string, string][] = [
    ["Name", input.name],
    ["Email", input.email],
    ["Company", input.company || "-"],
    ["Service", input.service],
    ["Budget", input.budget || "-"],
    ["Timeline", input.timeline || "-"],
  ];

  const text = [...rows.map(([k, v]) => `${k}: ${v}`), "", "Project description:", input.message].join("\n");
  const html = `<div style="font-family:system-ui,sans-serif;max-width:600px">
<h2 style="margin:0 0 16px">New project inquiry</h2>
<table cellpadding="6" style="border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="color:#666;vertical-align:top">${esc(k)}</td><td>${esc(v)}</td></tr>`)
    .join("")}</table>
<h3 style="margin:24px 0 8px">Project description</h3>
<p style="white-space:pre-wrap;margin:0">${esc(input.message)}</p></div>`;

  await transporter.sendMail({
    from: `"NMN.DEV Website" <${cfg.user}>`,
    to: cfg.to,
    replyTo: input.email,
    // single line, bounded: user input must never inject headers
    subject: `New inquiry: ${input.service} from ${input.name}`.replace(/[\r\n]+/g, " ").slice(0, 150),
    text,
    html,
  });
}
