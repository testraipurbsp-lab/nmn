import { colors } from "@/config/site";

/**
 * NMN mark: lime circular outline, geometric white N-M-N lettering and a lime
 * diamond at the centre of the M. Drawn as SVG so it stays crisp at any size.
 */
export function LogoMark({ size = 36, title }: { size?: number; title?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <circle cx="60" cy="60" r="56" fill={colors.ink} stroke={colors.lime} strokeWidth="3" />
      <g stroke={colors.paper} strokeWidth="4.5" strokeLinejoin="miter" strokeLinecap="square">
        <path d="M24 78V44L42 78V44" />
        <path d="M50 78V44L60 62L70 44V78" />
        <path d="M78 78V44L96 78V44" />
      </g>
      <path d="M60 58.5L64.5 64L60 69.5L55.5 64Z" fill={colors.lime} />
    </svg>
  );
}

export function Logo({ size = 34, className = "" }: { size?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark size={size} />
      <span className="text-[1.05rem] font-semibold tracking-[-0.02em] text-paper">
        NMN<span className="text-lime">.</span>DEV
      </span>
    </span>
  );
}
