/**
 * Original hero artwork: a technical drawing built from the NMN mark's own
 * geometry (ring, diamond, N-M-N strokes), with layered surfaces, a schematic
 * grid and a few drifting lime points. Pure SVG + CSS, no JS.
 */
const particles = [
  { x: "14%", y: "22%", d: "0s" },
  { x: "82%", y: "16%", d: "1.2s" },
  { x: "90%", y: "58%", d: "2.4s" },
  { x: "8%", y: "70%", d: "3.1s" },
  { x: "62%", y: "90%", d: "0.6s" },
];

export function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px]" aria-hidden>
      {/* ambient light */}
      <div className="ambient absolute inset-[-10%]" />

      {/* layered surfaces */}
      <div className="animate-float-slow absolute inset-[6%] rotate-[-4deg] border border-line bg-surface/80" />
      <div className="animate-float absolute inset-[12%] rotate-[3deg] border border-line bg-elevated/70" />

      <svg viewBox="0 0 400 400" className="relative size-full" fill="none">
        {/* technical grid + crosshair */}
        <g stroke="rgba(245,245,240,0.07)" strokeWidth="1">
          {[80, 160, 240, 320].map((p) => (
            <g key={p}>
              <line x1={p} y1="20" x2={p} y2="380" />
              <line x1="20" y1={p} x2="380" y2={p} />
            </g>
          ))}
        </g>
        <g stroke="rgba(245,245,240,0.28)" strokeWidth="1">
          <line x1="200" y1="14" x2="200" y2="34" />
          <line x1="200" y1="366" x2="200" y2="386" />
          <line x1="14" y1="200" x2="34" y2="200" />
          <line x1="366" y1="200" x2="386" y2="200" />
        </g>

        {/* outer dashed ring, slow rotation */}
        <g className="origin-center [transform-box:fill-box] motion-safe:animate-[spin_90s_linear_infinite]">
          <circle cx="200" cy="200" r="168" stroke="rgba(245,245,240,0.22)" strokeDasharray="2 8" />
        </g>

        {/* lime ring drawn in */}
        <circle
          cx="200"
          cy="200"
          r="138"
          stroke="#C6F55A"
          strokeWidth="2"
          className="draw"
          style={{ ["--len" as string]: 870, ["--d" as string]: "0.3s" }}
          transform="rotate(-90 200 200)"
        />

        {/* NMN strokes */}
        <g stroke="#F5F5F0" strokeWidth="7" strokeLinecap="square" strokeLinejoin="miter">
          <path
            d="M104 252V148L158 252V148"
            className="draw"
            style={{ ["--len" as string]: 400, ["--d" as string]: "0.9s" }}
          />
          <path
            d="M178 252V148L200 196L222 148V252"
            className="draw"
            style={{ ["--len" as string]: 400, ["--d" as string]: "1.1s" }}
          />
          <path
            d="M242 252V148L296 252V148"
            className="draw"
            style={{ ["--len" as string]: 400, ["--d" as string]: "1.3s" }}
          />
        </g>

        {/* diamond */}
        <g className="fade-in" style={{ ["--d" as string]: "1.7s" }}>
          <path d="M200 182L218 204L200 226L182 204Z" fill="#C6F55A" />
        </g>

        {/* dimension lines */}
        <g stroke="rgba(245,245,240,0.35)" strokeWidth="1">
          <line x1="104" y1="278" x2="296" y2="278" />
          <line x1="104" y1="272" x2="104" y2="284" />
          <line x1="296" y1="272" x2="296" y2="284" />
        </g>
        <g fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#92979F" letterSpacing="1.2">
          <text x="30" y="46">
            FIG. 01 / STRUCTURE · INTERFACE · LOGIC
          </text>
          <text x="370" y="46" textAnchor="end">
            NMN.DEV
          </text>
        </g>
      </svg>

      {/* scan line */}
      <div className="absolute inset-x-[10%] inset-y-[10%] overflow-hidden">
        <div className="animate-scan h-px w-full bg-gradient-to-r from-transparent via-lime/60 to-transparent" />
      </div>

      {/* code card */}
      <div className="fade-in absolute -bottom-10 -right-2 hidden w-[56%] border border-line-strong bg-ink/90 p-4 font-mono text-[0.68rem] leading-relaxed text-muted backdrop-blur sm:block md:-right-4" style={{ ["--d" as string]: "1.9s" }}>
        <div className="mb-2 flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-line-strong" />
          <span className="size-1.5 rounded-full bg-line-strong" />
          <span className="size-1.5 rounded-full bg-lime" />
          <span className="ml-2 text-[0.62rem] tracking-wider">product.ts</span>
        </div>
        <p className="type-line w-fit" style={{ ["--d" as string]: "2.1s", ["--n" as string]: 30, ["--t" as string]: "0.9s" }}>
          <span className="text-lime">async function</span> build(idea: Idea) {"{"}
        </p>
        <p className="type-line w-fit pl-3" style={{ ["--d" as string]: "3.1s", ["--n" as string]: 36, ["--t" as string]: "1s" }}>
          const plan = await <span className="text-paper">understand</span>(idea);
        </p>
        <p className="type-line w-fit pl-3" style={{ ["--d" as string]: "4.2s", ["--n" as string]: 22, ["--t" as string]: "0.7s" }}>
          return <span className="text-paper">engineer</span>(plan);
        </p>
        <p className="fade-in w-fit" style={{ ["--d" as string]: "5s" }}>
          {"}"}
          <span aria-hidden className="caret ml-1 inline-block h-3 w-[6px] translate-y-[2px] bg-lime" />
        </p>
      </div>

      {/* drifting points */}
      {particles.map((p, i) => (
        <span
          key={i}
          className="animate-drift absolute size-1 bg-lime"
          style={{ left: p.x, top: p.y, animationDelay: p.d }}
        />
      ))}
    </div>
  );
}
