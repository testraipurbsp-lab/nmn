"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

function Layer({ i, progress }: { i: number; progress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const y = useTransform(progress, [0, 1], [i * 8, i * 34]);
  return (
    <motion.path
      style={{ y }}
      d="M160 6 L300 36 L160 66 L20 36 Z"
      fill="#111419"
      stroke={i === 3 ? "#C6F55A" : "rgba(245,245,240,0.22)"}
    />
  );
}

/** Layered stack that fans apart as you scroll past it. */
export function StackDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 90%", "end 35%"] });
  const markerY = useTransform(scrollYProgress, [0, 1], [55, 133]);

  if (reduce) {
    return (
      <svg viewBox="0 0 320 175" className="mt-12 hidden w-full max-w-sm lg:block" fill="none" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <path key={i} transform={`translate(0 ${i * 30})`} d="M160 6 L300 36 L160 66 L20 36 Z" fill="#111419" stroke={i === 3 ? "#C6F55A" : "rgba(245,245,240,0.22)"} />
        ))}
        <path d="M160 115 L171 126 L160 137 L149 126 Z" fill="#C6F55A" />
      </svg>
    );
  }

  return (
    <div ref={ref} className="mt-12 hidden max-w-sm lg:block">
      <svg viewBox="0 0 320 180" className="w-full" fill="none" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <Layer key={i} i={i} progress={scrollYProgress} />
        ))}
        <motion.path style={{ y: markerY }} d="M160 -6 L171 5 L160 16 L149 5 Z" fill="#C6F55A" />
      </svg>
    </div>
  );
}