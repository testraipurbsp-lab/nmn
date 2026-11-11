import { z } from "zod";
import { budgetOptions, serviceOptions, timelineOptions } from "@/data/services";

/** Strip control chars and trim. Output is only ever used as text, never as HTML. */
const text = (max: number) =>
  z
    .string()
    .transform((v) => v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim())
    .pipe(z.string().max(max, `Keep this under ${max} characters.`));

const optionalOf = <T extends readonly [string, ...string[]]>(values: T) =>
  z.union([z.enum(values), z.literal("")]).optional();

export const contactSchema = z.object({
  name: text(100).pipe(z.string().min(2, "Enter your full name.")),
  email: text(200).pipe(z.string().email("Enter a valid email address.")),
  company: text(150).optional(),
  service: z.enum(serviceOptions, { error: "Choose a service." }),
  budget: optionalOf(budgetOptions),
  timeline: optionalOf(timelineOptions),
  message: text(5000).pipe(z.string().min(20, "Tell us a little more (at least 20 characters).")),
  /** Honeypot: real users never fill this. */
  website: z.string().max(0).optional(),
  /** Cloudflare Turnstile token when enabled. */
  turnstileToken: z.string().max(4096).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
