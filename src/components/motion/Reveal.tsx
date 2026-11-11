"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "article" | "section";
};

/** Scroll-triggered fade/translate. Renders statically when reduced motion is preferred. */
export function Reveal({ children, delay = 0, y = 24, className, as = "div" }: RevealProps) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  if (reduce) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.8, ease, delay }}
    >
      {children}
    </Comp>
  );
}

/** Horizontal line that draws itself in on scroll. */
export function DrawLine({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      className={`h-px origin-left bg-line-strong ${className}`}
      initial={reduce ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease }}
    />
  );
}
