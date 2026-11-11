"use client";

import { useEffect, useRef } from "react";

/** Soft lime light that follows the cursor inside the hero. Fine pointers only. */
export function HeroGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let tx = 0, ty = 0, x = 0, y = 0;
    const tick = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      el.style.transform = `translate3d(${x - 250}px, ${y - 250}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    const move = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      el.style.opacity = "1";
    };
    const leave = () => { el.style.opacity = "0"; };
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 size-[500px] rounded-full opacity-0 transition-opacity duration-500"
      style={{ background: "radial-gradient(circle, rgba(198,245,90,0.13), transparent 65%)" }}
    />
  );
}