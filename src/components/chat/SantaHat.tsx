/** Small decorative Santa hat. Sits on top of a round avatar or button. */
export function SantaHat({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 36" aria-hidden className={`pointer-events-none absolute ${className}`}>
      <path d="M6 27 C7 11 19 3 31 7 C28 9.5 27.5 13 28.5 17 C29.5 21 31.5 24.5 35 27 Z" fill="#E5484D" />
      <path d="M6 27 C6.4 20 9 14 13 10.5 C12 16 12 22 14 27 Z" fill="#C93A40" />
      <circle cx="32" cy="7" r="4.6" fill="#F5F5F0" />
      <rect x="3" y="24" width="36" height="9" rx="4.5" fill="#F5F5F0" />
      <rect x="3" y="29.5" width="36" height="3.5" rx="1.75" fill="#DAD9D2" />
    </svg>
  );
}