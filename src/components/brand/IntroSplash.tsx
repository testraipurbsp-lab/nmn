"use client";

import { useEffect, useRef, useState } from "react";

const DURATION = 3000; // ms the intro holds before the curtain lifts
const EXIT = 900; // ms for the curtain to lift

/** Logo intro. Plays on every full page load or reload; skipped for reduced motion. */
export function IntroSplash() {
  const [phase, setPhase] = useState<"in" | "out" | "done">("in");
  const counter = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      const t = setTimeout(() => setPhase("done"), 0);
      return () => clearTimeout(t);
    }
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";

    // Counter + bar share one eased clock.
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / (DURATION - 200), 1);
      const eased = 1 - Math.pow(1 - t, 3);
      if (counter.current) counter.current.textContent = String(Math.round(eased * 100)).padStart(3, "0");
      if (bar.current) bar.current.style.transform = `scaleX(${eased})`;
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const t1 = setTimeout(() => setPhase("out"), DURATION);
    const t2 = setTimeout(() => setPhase("done"), DURATION + EXIT);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setPhase("out"); };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("keydown", onKey);
      root.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    // Let the page's own entrance animations start as the curtain lifts.
    if (phase !== "in") document.documentElement.classList.remove("intro-active");
    if (phase === "out") {
      const t = setTimeout(() => setPhase("done"), EXIT);
      return () => clearTimeout(t);
    }
    if (phase === "done") document.documentElement.style.overflow = "";
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden
      onClick={() => setPhase("out")}
      data-phase={phase}
      className="intro fixed inset-0 z-[100] cursor-pointer overflow-hidden border-b border-lime bg-ink"
    >
      <div className="bg-grid intro-grid absolute inset-0" />
      <div className="intro-glow absolute left-1/2 top-1/2 size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full" />

      <div className="intro-content absolute inset-0 flex flex-col items-center justify-center">
        <svg width="148" height="148" viewBox="0 0 120 120" fill="none" className="relative">
          <circle className="intro-fill" cx="60" cy="60" r="56" fill="#0B0D10" />
          <circle className="intro-draw" pathLength={1} cx="60" cy="60" r="56" stroke="#C6F55A" strokeWidth="3" style={{ ["--d" as string]: "0.1s" }} />
          <g stroke="#F5F5F0" strokeWidth="4.5" strokeLinecap="square" strokeLinejoin="miter">
            <path className="intro-draw" pathLength={1} d="M24 78V44L42 78V44" style={{ ["--d" as string]: "0.6s" }} />
            <path className="intro-draw" pathLength={1} d="M50 78V44L60 62L70 44V78" style={{ ["--d" as string]: "0.8s" }} />
            <path className="intro-draw" pathLength={1} d="M78 78V44L96 78V44" style={{ ["--d" as string]: "1s" }} />
          </g>
          <path className="intro-pop" d="M60 58.5L64.5 64L60 69.5L55.5 64Z" fill="#C6F55A" style={{ ["--d" as string]: "1.5s" }} />
        </svg>

        <div className="mt-9 text-center">
          <span className="mask-line text-3xl font-semibold tracking-[-0.03em] text-paper md:text-4xl">
            <span style={{ ["--d" as string]: "1.45s" }}>
              NMN<span className="text-lime">.</span>DEV
            </span>
          </span>
          <span className="mask-line mt-3 font-mono text-[0.7rem] uppercase tracking-[0.28em] text-muted">
            <span style={{ ["--d" as string]: "1.6s" }}>Software Development Studio</span>
          </span>
        </div>
      </div>

      <div className="intro-meta absolute inset-x-0 bottom-0 flex items-end justify-between px-6 pb-7 md:px-10 md:pb-9">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted">Initialising</span>
        <span ref={counter} className="font-mono text-sm tabular-nums text-paper">000</span>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-line">
        <div ref={bar} className="h-full origin-left scale-x-0 bg-lime" />
      </div>
    </div>
  );
}