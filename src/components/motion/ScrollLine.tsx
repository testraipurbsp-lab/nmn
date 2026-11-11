"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll } from "framer-motion";

/** Line that fills with lime as you scroll past it. */
export function ScrollLine({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "start 30%"] });
  return (
    <div ref={ref} aria-hidden className={`relative h-px bg-line-strong ${className}`}>
      <motion.div
        style={{ scaleX: reduce ? 1 : scrollYProgress }}
        className="absolute inset-0 origin-left bg-lime"
      />
    </div>
  );
}
