import nodemailer from "nodemailer";
import { Resend } from "resend";
import type { ContactInput } from "./contact-schema";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** Trim and strip wrapping quotes so a pasted `"value"` still works. */
const env = (name: string) => process.env[name]?.trim().replace(/^["']|["']$/g, "").trim() || undefined;

export type EmailConfig =
  | { provider: "resend"; apiKey: string; from: string; to: string }
  | { provider: "gmail"; user: string; pass: string; to: string };

/** Which variables are present. Names only, never values. */
export function emailStatus() {
  const resend = {
    RESEND_API_KEY: Boolean(env("RESEND_API_KEY")),
    CONTACT_FROM_EMAIL: Boolean(env("CONTACT_FROM_EMAIL")),
    CONTACT_TO_EMAIL: Boolean(env("CONTACT_TO_EMAIL")),
  };
  const gmail = {
    GMAIL_USER: Boolean(env("GMAIL_USER")),
    GMAIL_APP_PASSWORD: Boolean(env("GMAIL_APP_PASSWORD")),
  };
  return { resend, gmail };
}

/** Resend if its three variables are set, otherwise Gmail, otherwise null. */
export function emailConfig(): EmailConfig | null {
  const apiKey = env("RESEND_API_KEY");
  const from = env("CONTACT_FROM_EMAIL");
  const to = env("CONTACT_TO_EMAIL");
  if (apiKey && from && to) return { provider: "resend", apiKey, from, to };

  const user = env("GMAIL_USER");
  const pass = env("GMAIL_APP_PASSWORD")?.replace(/\s/g, "");
  if (user && pass) return { provider: "gmail", user, pass, to: to || user };
  return null;
}

export async function sendInquiry(input: ContactInput) {
  const cfg = emailConfig();
  if (!cfg) throw new Error("EMAIL_NOT_CONFIGURED");

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
  // single line, bounded: user input must never inject headers
  const subject = `New inquiry: ${input.service} from ${input.name}`.replace(/[\r\n]+/g, " ").slice(0, 150);

  if (cfg.provider === "resend") {
    const { error } = await new Resend(cfg.apiKey).emails.send({
      from: cfg.from,
      to: cfg.to,
      replyTo: input.email,
      subject,
      text,
      html,
    });
    if (error) throw new Error(`RESEND_ERROR: ${error.message}`);
    return;
  }

  await nodemailer
    .createTransport({ service: "gmail", auth: { user: cfg.user, pass: cfg.pass } })
    .sendMail({
      from: `"NMN.DEV Website" <${cfg.user}>`,
      to: cfg.to,
      replyTo: input.email,
      subject,
      text,
      html,
    });
}