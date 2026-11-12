"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";
import { MENU_CHIPS, OPENING, afterSend, initialBrain, respond, type Brain, type Lead } from "@/lib/chat-brain";

type Msg = { id: number; from: "bot" | "user"; text: string };

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [chips, setChips] = useState<string[]>([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [hint, setHint] = useState(false);

  const brain = useRef<Brain>(initialBrain());
  const queue = useRef<string[]>([]);
  const running = useRef(false);
  const started = useRef(false);
  const alive = useRef(true);
  const nextId = useRef(1);
  const speed = useRef(1);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    alive.current = true;
    speed.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0.2 : 1;
    return () => {
      alive.current = false;
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setHint(true), 4000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, chips, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const push = useCallback((from: Msg["from"], text: string) => {
    setMessages((m) => [...m, { id: nextId.current++, from, text }]);
  }, []);

  /** Show bot messages one by one, with a typing indicator sized to the message. */
  const speak = useCallback(
    async (lines: string[]) => {
      for (const line of lines) {
        if (!alive.current) return;
        setTyping(true);
        await sleep((450 + Math.min(line.length * 14, 1300)) * speed.current);
        if (!alive.current) return;
        setTyping(false);
        push("bot", line);
        await sleep(220 * speed.current);
      }
    },
    [push],
  );

  const post = async (lead: Lead) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: lead.name,
          email: lead.email,
          service: lead.service,
          budget: lead.budget || undefined,
          timeline: lead.timeline || undefined,
          message: `[Sent via website chatbot]\n\n${lead.message}`,
        }),
      });
      const body = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      return res.ok && body?.ok ? { ok: true } : { ok: false, error: body?.error };
    } catch {
      return { ok: false, error: "Network error. Check your connection." };
    }
  };

  /** Handle queued visitor messages one at a time, so quick typists never get tangled replies. */
  const drain = useCallback(async () => {
    if (running.current) return;
    running.current = true;
    while (queue.current.length && alive.current) {
      const text = queue.current.shift() as string;
      setChips([]);
      await sleep(350 * speed.current);
      const r = respond(brain.current, text);
      brain.current = r.brain;
      await speak(r.say);
      if (r.send) {
        const lead = brain.current.lead;
        const result = await post(lead);
        const after = afterSend(brain.current, result);
        brain.current = after.brain;
        await speak(after.say);
        setChips(after.chips);
      } else {
        setChips(r.chips);
      }
    }
    running.current = false;
  }, [speak]);

  const say = useCallback(
    (text: string) => {
      const value = text.trim();
      if (!value) return;
      push("user", value);
      queue.current.push(value);
      void drain();
    },
    [drain, push],
  );

  // Greet the first time the chat opens.
  useEffect(() => {
    if (!open || started.current) return;
    started.current = true;
    void (async () => {
      running.current = true;
      await speak(OPENING);
      setChips(MENU_CHIPS);
      running.current = false;
      if (queue.current.length) void drain();
    })();
  }, [open, speak, drain]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open, chips]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = input;
    setInput("");
    say(v);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="NMN.DEV assistant"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-20 right-4 z-30 flex h-[min(600px,calc(100dvh-7rem))] w-[calc(100vw-2rem)] flex-col border border-line-strong bg-surface shadow-2xl sm:w-[390px]"
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="relative flex size-9 items-center justify-center rounded-full border border-line-strong bg-ink text-[0.7rem] font-semibold tracking-tight text-lime">
                  NMN
                  <span aria-hidden className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-surface bg-lime" />
                </span>
                <div>
                  <p className="text-sm font-medium leading-tight">NMN.DEV assistant</p>
                  <p className="text-xs text-muted">{typing ? "typing…" : "Ask anything or share your project"}</p>
                </div>
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

            <div ref={logRef} role="log" aria-live="polite" className="flex-1 space-y-2.5 overflow-y-auto px-4 py-4">
              {messages.map((m) => (
                <div key={m.id} className={`chat-in flex ${m.from === "user" ? "justify-end" : ""}`}>
                  <p
                    className={`max-w-[86%] whitespace-pre-line px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.from === "user"
                        ? "rounded-2xl rounded-br-sm bg-lime text-ink"
                        : "rounded-2xl rounded-bl-sm bg-elevated text-paper"
                    }`}
                  >
                    {m.text}
                  </p>
                </div>
              ))}

              {typing && (
                <div className="chat-in flex">
                  <p
                    className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-elevated px-4 py-3.5"
                    aria-label="Assistant is typing"
                  >
                    <span className="typing-dot" />
                    <span className="typing-dot" style={{ animationDelay: "0.15s" }} />
                    <span className="typing-dot" style={{ animationDelay: "0.3s" }} />
                  </p>
                </div>
              )}

              {chips.length > 0 && !typing && (
                <div className="chat-in flex flex-wrap gap-2 pt-1">
                  {chips.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => say(c)}
                      className="rounded-full border border-line-strong px-3 py-1.5 text-left text-[0.82rem] text-paper transition-colors hover:border-lime hover:text-lime"
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
                maxLength={1000}
                type="text"
                autoComplete="off"
                placeholder="Type a message…"
                className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-paper placeholder:text-muted focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send"
                className="inline-flex size-9 items-center justify-center rounded-full bg-lime text-ink transition-opacity disabled:opacity-40"
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