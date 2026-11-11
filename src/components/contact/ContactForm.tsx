"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, ChevronDown, Loader2, Send } from "lucide-react";
import { buttonStyles } from "@/components/ui/Button";
import { contactSchema } from "@/lib/contact-schema";
import { budgetOptions, serviceOptions, timelineOptions } from "@/data/services";

type FormInput = z.input<typeof contactSchema>;
type FormOutput = z.output<typeof contactSchema>;

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
    };
  }
}

type Status = "idle" | "submitting" | "success" | "error";

function Field({
  id,
  label,
  optional,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between text-sm text-muted">
        <span>{label}</span>
        {optional && <span className="font-mono text-[0.65rem] uppercase tracking-[0.12em]">Optional</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-[#ff8a7a]">
          {error}
        </p>
      )}
    </div>
  );
}

function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select className="field pr-8" {...props}>
        {children}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute right-0 top-1/2 size-4 -translate-y-1/2 text-muted" />
    </div>
  );
}

export function ContactForm({
  defaultService,
  turnstileSiteKey,
}: {
  defaultService?: string;
  turnstileSiteKey?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [token, setToken] = useState<string>("");
  const tsRef = useRef<HTMLDivElement>(null);
  const tsId = useRef<string | undefined>(undefined);
  const successRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      company: "",
      service: (serviceOptions as readonly string[]).includes(defaultService ?? "")
        ? (defaultService as FormInput["service"])
        : ("" as FormInput["service"]),
      budget: "",
      timeline: "",
      message: "",
      website: "",
    },
  });

  // Cloudflare Turnstile (only when a site key is configured)
  useEffect(() => {
    if (!turnstileSiteKey) return;
    const mount = () => {
      if (!tsRef.current || !window.turnstile || tsId.current) return;
      tsId.current = window.turnstile.render(tsRef.current, {
        sitekey: turnstileSiteKey,
        theme: "dark",
        callback: (t: string) => setToken(t),
        "expired-callback": () => setToken(""),
        "error-callback": () => setToken(""),
      });
    };
    if (window.turnstile) return mount();
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.defer = true;
    s.onload = mount;
    document.head.appendChild(s);
  }, [turnstileSiteKey]);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const onSubmit = async (data: FormOutput) => {
    setStatus("submitting");
    setServerError(null);

    if (turnstileSiteKey && !token) {
      setStatus("error");
      setServerError("Please complete the spam check below and try again.");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, turnstileToken: token || undefined }),
      });
      const body = (await res.json().catch(() => null)) as
        | { ok: boolean; error?: string; fieldErrors?: Record<string, string> }
        | null;

      if (res.ok && body?.ok) {
        reset();
        setStatus("success");
        return;
      }

      if (body?.fieldErrors) {
        for (const [field, message] of Object.entries(body.fieldErrors)) {
          setError(field as keyof FormInput, { type: "server", message });
        }
      }
      setServerError(body?.error ?? "Something went wrong. Please try again.");
      setStatus("error");
    } catch {
      setServerError("Network error. Check your connection and try again.");
      setStatus("error");
    } finally {
      if (turnstileSiteKey && tsId.current) {
        window.turnstile?.reset(tsId.current);
        setToken("");
      }
    }
  };

  const invalid = (name: keyof FormInput) => (errors[name] ? true : undefined);
  const describe = (name: keyof FormInput) => (errors[name] ? `${name}-error` : undefined);

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "success" ? (
        <motion.div
          key="success"
          ref={successRef}
          tabIndex={-1}
          role="status"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-line-strong bg-surface p-8 outline-none md:p-12"
        >
          <CheckCircle2 aria-hidden className="size-9 text-lime" strokeWidth={1.5} />
          <h2 className="mt-6 text-3xl font-medium tracking-[-0.03em]">Message sent.</h2>
          <p className="mt-3 max-w-md text-muted">
            Thanks for reaching out. We&apos;ll read your message and reply by email.
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className={buttonStyles("secondary", "mt-8")}
          >
            Send another message
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="grid gap-x-8 gap-y-7 sm:grid-cols-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          aria-busy={status === "submitting"}
        >
          <Field id="name" label="Full name" error={errors.name?.message}>
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              className="field"
              aria-invalid={invalid("name")}
              aria-describedby={describe("name")}
              {...register("name")}
            />
          </Field>
          <Field id="email" label="Email address" error={errors.email?.message}>
            <input
              id="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="you@company.com"
              className="field"
              aria-invalid={invalid("email")}
              aria-describedby={describe("email")}
              {...register("email")}
            />
          </Field>
          <Field id="company" label="Company / Business" optional error={errors.company?.message}>
            <input
              id="company"
              type="text"
              autoComplete="organization"
              placeholder="Company name"
              className="field"
              aria-invalid={invalid("company")}
              aria-describedby={describe("company")}
              {...register("company")}
            />
          </Field>
          <Field id="service" label="Service required" error={errors.service?.message}>
            <Select
              id="service"
              aria-invalid={invalid("service")}
              aria-describedby={describe("service")}
              {...register("service")}
            >
              <option value="" disabled>
                Select a service
              </option>
              {serviceOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </Select>
          </Field>
          <Field id="budget" label="Estimated budget" optional error={errors.budget?.message}>
            <Select id="budget" aria-describedby={describe("budget")} {...register("budget")}>
              <option value="">Select a range</option>
              {budgetOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </Select>
          </Field>
          <Field id="timeline" label="Project timeline" optional error={errors.timeline?.message}>
            <Select id="timeline" aria-describedby={describe("timeline")} {...register("timeline")}>
              <option value="">Select a timeline</option>
              {timelineOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </Select>
          </Field>

          <div className="sm:col-span-2">
            <Field id="message" label="Project description" error={errors.message?.message}>
              <textarea
                id="message"
                rows={5}
                placeholder="What are you building, and what should it achieve?"
                className="field resize-y"
                aria-invalid={invalid("message")}
                aria-describedby={describe("message")}
                {...register("message")}
              />
            </Field>
          </div>

          {/* Honeypot: hidden from people and assistive tech */}
          <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label htmlFor="website">Leave this field empty</label>
            <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
          </div>

          {turnstileSiteKey && <div ref={tsRef} className="sm:col-span-2" />}

          <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
            <button type="submit" disabled={status === "submitting"} className={buttonStyles("primary", "w-full sm:w-auto")}>
              {status === "submitting" ? (
                <>
                  <Loader2 aria-hidden className="size-4 animate-spin" /> Sending…
                </>
              ) : (
                <>
                  Send message <Send aria-hidden className="size-4" />
                </>
              )}
            </button>
            <p className="text-sm text-muted">We only use your details to reply to this enquiry.</p>
          </div>

          {status === "error" && serverError && (
            <div
              role="alert"
              className="flex items-start gap-3 border border-[#ff8a7a]/40 bg-[#ff8a7a]/5 p-4 text-sm text-paper sm:col-span-2"
            >
              <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0 text-[#ff8a7a]" />
              {serverError}
            </div>
          )}
        </motion.form>
      )}
    </AnimatePresence>
  );
}
