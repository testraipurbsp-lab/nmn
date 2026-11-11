"use client";

import { motion, useReducedMotion } from "framer-motion";

type Props = {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  id?: string;
  delay?: number;
};

const ease = [0.16, 1, 0.3, 1] as const;
const word = {
  hidden: { y: "115%" },
  show: { y: 0, transition: { duration: 0.9, ease } },
};

/**
 * Heading whose words slide up out of a mask, staggered, when scrolled into view.
 * The in-view trigger sits on the (untransformed) parent, because a child that is
 * translated outside its clipping mask would never count as visible.
 */
export function SplitHeading({ text, as: Tag = "h2", className, id, delay = 0 }: Props) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <Tag id={id} className={className}>
        {text}
      </Tag>
    );
  }
  const words = text.split(" ");
  return (
    <Tag id={id} className={className} aria-label={text}>
      <motion.span
        aria-hidden
        className="block"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -60px 0px" }}
        transition={{ staggerChildren: 0.05, delayChildren: delay }}
      >
        {words.map((w, i) => (
          <span key={i}>
            <span className="inline-block overflow-hidden pb-[0.14em] align-bottom -mb-[0.14em]">
              <motion.span variants={word} className="inline-block will-change-transform">
                {w}
              </motion.span>
            </span>
            {i < words.length - 1 ? " " : null}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
