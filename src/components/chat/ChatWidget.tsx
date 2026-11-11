"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";
import { contactSchema } from "@/lib/contact-schema";
import { budgetOptions, services, timelineOptions } from "@/data/services";

type Msg = { from: "bot" | "user"; text: string };
type Step =
  | "menu"
  | "service"
  | "budget"
  | "timeline"
  | "message"
  | "name"
  | "email"
  | "retry"
  | "done";
type Lead = {
  service?: string;
  budget?: string;
  timeline?: string;
  message?: string;
  name?: string;
  email?: string;
};

const START = "Start a project";
const AGAIN = "Start over";
const RETRY = "Try sending again";

const greeting: Msg = {
  from: "bot",
  text: "Hi! I can tell you what NMN.DEV builds, or take your project details and send them to the team. Pick a topic below.",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([greeting]);
  const [step, setStep] = useState<Step>("menu");
  const [lead, setLead] = useState<Lead>({});
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages, step, open]);

  useEffect(() => {
    const t = setTimeout(() => setHint(true), 4000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open && ["message", "name", "email"].includes(step)) inputRef.current?.focus();
  }, [open, step]);

  const say = (...m: Msg[]) => setMessages((prev) => [...prev, ...m]);
  const user = (text: string): Msg => ({ from: "user", text });
  const bot = (text: string): Msg => ({ from: "bot", text });

  const chips: string[] =
    step === "menu"
      ? [...services.map((s) => s.title), START]
      : step === "service"
        ? [...services.map((s) => s.formValue), "Other"]
        : step === "budget"
          ? [...budgetOptions]
          : step === "timeline"
            ? [...timelineOptions]
            : step === "retry"
              ? [RETRY]
              : step === "done"
                ? [AGAIN]
                : [];

  const reset = () => {
    setMessages([greeting]);
    setLead({});
    setStep("menu");
    setInput("");
  };

  const send = async (data: Lead) => {
    setBusy(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          service: data.service,
          budget: data.budget,
          timeline: data.timeline,
          message: `[Sent via website chatbot]\n\n${data.message}`,
        }),
      });
      const body = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (res.ok && body?.ok) {
        say(
          bot(
            `Thanks ${data.name?.split(" ")[0]}, your details are with the team. They'll reply to ${data.email} soon.`,
          ),
        );
        setStep("done");
      } else {
        say(
          bot(
            `${body?.error ?? "Something went wrong."} You can try again, or use the contact page at /contact.`,
          ),
        );
        setStep("retry");
      }
    } catch {
      say(bot("Network error. Check your connection and try again."));
      setStep("retry");
    } finally {
      setBusy(false);
    }
  };

  const onChip = (label: string) => {
    if (busy) return;
    say(user(label));

    if (step === "menu") {
      if (label === START) {
        if (lead.service) {
          say(bot("Great. What budget range do you have in mind?"));
          setStep("budget");
        } else {
          say(bot("Which service do you need?"));
          setStep("service");
        }
        return;
      }
      const s = services.find((x) => x.title === label);
      if (s) {
        setLead((l) => ({ ...l, service: s.formValue }));
        say(
          bot(
            `${s.title}: ${s.overview}\n\nWhat we cover: ${s.capabilities.slice(0, 4).join(", ")}.\nTechnologies: ${s.technologies.join(", ")}.`,
          ),
          bot("Ask about another service, or choose Start a project."),
        );
      }
      return;
    }
    if (step === "service") {
      setLead((l) => ({ ...l, service: label }));
      say(bot("What budget range do you have in mind?"));
      setStep("budget");
    } else if (step === "budget") {
      setLead((l) => ({ ...l, budget: label }));
      say(bot("When do you need it?"));
      setStep("timeline");
    } else if (step === "timeline") {
      setLead((l) => ({ ...l, timeline: label }));
      say(bot("Describe what you want to build in a few sentences."));
      setStep("message");
    } else if (step === "retry") {
      void send(lead);
    } else if (step === "done") {
      reset();
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = input.trim();
    if (!value || busy) return;
    setInput("");

    if (step === "message") {
      const r = contactSchema.shape.message.safeParse(value);
      say(user(value));
      if (!r.success) return say(bot(r.error.issues[0]?.message ?? "Please add more detail."));
      setLead((l) => ({ ...l, message: r.data }));
      say(bot("Thanks. What's your name?"));
      setStep("name");
    } else if (step === "name") {
      const r = contactSchema.shape.name.safeParse(value);
      say(user(value));
      if (!r.success) return say(bot(r.error.issues[0]?.message ?? "Enter your full name."));
      setLead((l) => ({ ...l, name: r.data }));
      say(bot("And your email address, so the team can reply?"));
      setStep("email");
    } else if (step === "email") {
      const r = contactSchema.shape.email.safeParse(value);
      say(user(value));
      if (!r.success) return say(bot(r.error.issues[0]?.message ?? "Enter a valid email address."));
      const next = { ...lead, email: r.data };
      setLead(next);
      say(bot("Sending your details…"));
      void send(next);
    }
  };

  const typing = ["message", "name", "email"].includes(step);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="NMN.DEV assistant"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-20 right-4 z-30 flex h-[min(560px,calc(100dvh-7rem))] w-[calc(100vw-2rem)] flex-col border border-line-strong bg-surface shadow-2xl sm:w-[380px]"
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <div>
                <p className="text-sm font-medium">NMN.DEV assistant</p>
                <p className="text-xs text-muted">Services info and project enquiries</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="inline-flex size-9 items-center justify-center text-muted hover:text-paper"
              >
                <X className="size-5" />
              </button>
            </div>

            <div
              ref={logRef}
              role="log"
              aria-live="polite"
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              {messages.map((m, i) => (
                <div key={i} className={m.from === "user" ? "flex justify-end" : "flex"}>
                  <p
                    className={`max-w-[88%] whitespace-pre-line px-3 py-2 text-sm leading-relaxed ${
                      m.from === "user" ? "bg-lime text-ink" : "bg-elevated text-paper"
                    }`}
                  >
                    {m.text}
                  </p>
                </div>
              ))}

              {chips.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {chips.map((c) => (
                    <button
                      key={c}
                      type="button"
                      disabled={busy}
                      onClick={() => onChip(c)}
                      className="border border-line-strong px-3 py-1.5 text-left text-sm text-paper transition-colors hover:border-lime hover:text-lime disabled:opacity-50"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={onSubmit} noValidate className="flex items-center gap-2 border-t border-line p-3">
              <label htmlFor="chat-input" className="sr-only">
                Your message
              </label>
              <input
                id="chat-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={!typing || busy}
                maxLength={2000}
                type={step === "email" ? "email" : "text"}
                autoComplete={step === "email" ? "email" : step === "name" ? "name" : "off"}
                placeholder={typing ? "Type your answer" : "Choose an option above"}
                className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-paper placeholder:text-muted focus:outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!typing || busy || !input.trim()}
                aria-label="Send"
                className="inline-flex size-9 items-center justify-center bg-lime text-ink disabled:opacity-40"
              >
                <Send className="size-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {hint && !open && (
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            setHint(false);
          }}
          className="fade-in fixed bottom-6 right-[5.25rem] z-30 border border-line-strong bg-elevated px-3 py-2 text-sm text-paper shadow-xl"
        >
          Questions? Ask our assistant
        </button>
      )}

      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          setHint(false);
        }}
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Chat with NMN.DEV"}
        className="fixed bottom-4 right-4 z-30 inline-flex size-14 items-center justify-center rounded-full bg-lime text-ink shadow-[0_0_0_6px_var(--color-glow)] transition-transform hover:scale-105"
      >
        {!open && <span aria-hidden className="animate-pulse-ring absolute inset-0 -z-10 rounded-full bg-lime/40" />}
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>
    </>
  );
}
