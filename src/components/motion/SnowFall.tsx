"use client";

import { useEffect, useRef, useState } from "react";
import { Snowflake } from "lucide-react";

const KEY = "nmn-snow";

/** Snow shows November to February. Force it with NEXT_PUBLIC_WINTER=on or off. */
function inSeason() {
  const force = process.env.NEXT_PUBLIC_WINTER;
  if (force === "on") return true;
  if (force === "off") return false;
  const m = new Date().getMonth();
  return m === 10 || m === 11 || m === 0 || m === 1;
}

type Flake = { x: number; y: number; r: number; vy: number; phase: number; sway: number; a: number; lime: boolean };

/** Gentle snowfall over the whole site, with a small switch to turn it off. */
export function SnowFall() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [on, setOn] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let pref = true;
    try { pref = localStorage.getItem(KEY) !== "off"; } catch {}
    const t = setTimeout(() => {
      setOn(pref);
      setReady(inSeason() && !reduce);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = canvas.current;
    if (!ready || !on || !el) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, raf = 0, lastY = window.scrollY;
    let flakes: Flake[] = [];
    const make = (initial: boolean): Flake => {
      const r = 0.8 + Math.random() * 2;
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : -10,
        r,
        vy: 0.25 + r * 0.28,
        phase: Math.random() * Math.PI * 2,
        sway: 0.2 + Math.random() * 0.5,
        a: 0.22 + (r / 2.8) * 0.55,
        lime: Math.random() < 0.08,
      };
    };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      el.width = w * dpr;
      el.height = h * dpr;
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(w < 700 ? 34 : 85, w / 16));
      flakes = Array.from({ length: count }, () => make(true));
    };

    const tick = () => {
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      ctx.clearRect(0, 0, w, h);
      for (const f of flakes) {
        f.phase += 0.012;
        f.x += Math.sin(f.phase) * f.sway;
        f.y += f.vy - dy * (f.r / 6); // larger flakes drift a little with scroll
        if (f.y > h + 10 || f.y < -40) Object.assign(f, make(false), { y: f.y < 0 ? h + 5 : -10 });
        if (f.x > w + 10) f.x = -10;
        if (f.x < -10) f.x = w + 10;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = f.lime ? `rgba(198,245,90,${f.a * 0.8})` : `rgba(245,245,240,${f.a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(tick);
    };

    resize();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [ready, on]);

  if (!ready) return null;

  return (
    <>
      {on && <canvas ref={canvas} aria-hidden className="pointer-events-none fixed inset-0 z-20" />}
      <button
        type="button"
        aria-pressed={on}
        aria-label={on ? "Turn snow off" : "Turn snow on"}
        title={on ? "Turn snow off" : "Turn snow on"}
        onClick={() => {
          const next = !on;
          setOn(next);
          try { localStorage.setItem(KEY, next ? "on" : "off"); } catch {}
        }}
        className={`fixed bottom-3 left-2 z-30 inline-flex size-8 items-center justify-center rounded-full border border-line-strong bg-elevated/80 backdrop-blur transition-colors hover:text-lime ${
          on ? "text-paper" : "text-muted"
        }`}
      >
        <Snowflake className="size-4" />
      </button>
    </>
  );
}