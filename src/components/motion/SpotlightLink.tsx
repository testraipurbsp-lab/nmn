"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

/** Link that lights up softly around the cursor while hovered (see .spotlight in globals.css). */
export function SpotlightLink({ className = "", ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className={`spotlight ${className}`}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    />
  );
}
