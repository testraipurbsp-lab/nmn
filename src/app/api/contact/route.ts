import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact-schema";
import { emailConfig, sendInquiry } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { site } from "@/config/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 20_000;

const json = (body: Record<string, unknown>, status = 200, headers?: HeadersInit) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

/** Only accept same-site browser posts. */
function originAllowed(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return process.env.NODE_ENV !== "production";
  try {
    const o = new URL(origin);
    const allowed = new Set([new URL(site.url).host, req.headers.get("host") ?? ""]);
    return allowed.has(o.host);
  } catch {
    return false;
  }
}

async function verifyTurnstile(token: string | undefined, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) return true; // not enabled
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(5000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  if (!originAllowed(req)) return json({ ok: false, error: "Request not allowed." }, 403);
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return json({ ok: false, error: "Unsupported content type." }, 415);
  }

  const ip = clientIp(req);
  const limit = rateLimit(`contact:${ip}`);
  if (!limit.ok) {
    return json(
      { ok: false, error: "Too many submissions. Please try again in a few minutes." },
      429,
      { "Retry-After": String(limit.retryAfter) },
    );
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return json({ ok: false, error: "Message is too large." }, 413);

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "Invalid request." }, 400);
  }

  // Honeypot: pretend success so bots learn nothing, but send nothing.
  if (
    typeof payload === "object" &&
    payload !== null &&
    "website" in payload &&
    typeof (payload as { website: unknown }).website === "string" &&
    (payload as { website: string }).website.length > 0
  ) {
    return json({ ok: true });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return json({ ok: false, error: "Please check the highlighted fields.", fieldErrors }, 422);
  }

  if (!(await verifyTurnstile(parsed.data.turnstileToken, ip))) {
    return json({ ok: false, error: "Spam check failed. Reload the page and try again." }, 400);
  }

  if (!emailConfig()) {
    console.error("[contact] Email delivery is not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD.");
    return json(
      {
        ok: false,
        error: "Our contact form isn't accepting messages right now. Please try again later.",
      },
      503,
    );
  }

  try {
    await sendInquiry(parsed.data);
    return json({ ok: true });
  } catch (err) {
    console.error("[contact] Failed to send inquiry:", err instanceof Error ? err.message : err);
    return json({ ok: false, error: "We couldn't send your message. Please try again in a moment." }, 502);
  }
}

export function GET() {
  return json({ ok: false, error: "Method not allowed." }, 405, { Allow: "POST" });
}
