"use client";

import { useEffect, useState } from "react";

/** Snow season: November to February. Force with NEXT_PUBLIC_WINTER=on or off. */
function inSeason() {
  const force = process.env.NEXT_PUBLIC_WINTER;
  if (force === "on") return true;
  if (force === "off") return false;
  const m = new Date().getMonth();
  return m === 10 || m === 11 || m === 0 || m === 1;
}

/**
 * A little pile of snow that sits on top of an element, like snow on a roof.
 * Put it inside a `relative` wrapper, as the first child. Decoration only.
 */
export function SnowRoof({ className = "" }: { className?: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(inSeason()), 0);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;

  return (
    <svg
      aria-hidden
      viewBox="0 0 120 22"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute -left-[5px] -right-[5px] -top-[11px] z-10 h-[22px] w-[calc(100%+10px)] drop-shadow-[0_2px_2px_rgba(0,0,0,0.35)] ${className}`}
    >
      {/* shaded under-layer */}
      <path
        fill="#CFD2CB"
        d="M2 16C2 12 8 11 12 11C15 6 25 5 32 7C40 3 56 3 64 7C74 4 88 5 96 8C103 7 113 9 115 12C119 12 120 15 118 17C113 19 8 19 2 16Z"
      />
      {/* bright snow */}
      <path
        fill="#F5F5F0"
        d="M0 14C0 10 6 9 11 9C14 3 25 2 33 5C41 0 57 0 65 5C75 1 89 2 97 6C104 5 114 7 116 10C120 10 121 13 119 15C115 17 108 16 104 17C100 20 95 17 92 16C86 18 80 16 76 16C71 19 66 16 62 16C56 18 48 16 44 16C40 19 34 16 30 16C24 18 16 16 12 16C8 17 3 17 0 14Z"
      />
      {/* a couple of small drips */}
      <path fill="#F5F5F0" d="M24 15h6l-3 7z" fillOpacity=".95" />
      <path fill="#F5F5F0" d="M88 15h5l-2.5 5z" fillOpacity=".95" />
    </svg>
  );
}