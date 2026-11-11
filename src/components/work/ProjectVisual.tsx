import type { ProjectVisualKind } from "@/data/projects";

const L = "#C6F55A";
const P = "#F5F5F0";
const line = "rgba(245,245,240,0.12)";
const dim = "rgba(245,245,240,0.32)";
const faint = "rgba(245,245,240,0.08)";

function Chrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <rect x="0" y="0" width="640" height="400" fill="#111419" />
      <rect x="0" y="0" width="640" height="30" fill="#0B0D10" />
      <line x1="0" y1="30" x2="640" y2="30" stroke={line} />
      <circle cx="16" cy="15" r="3" fill={dim} />
      <circle cx="28" cy="15" r="3" fill={dim} />
      <circle cx="40" cy="15" r="3" fill={L} />
      <rect x="220" y="8" width="200" height="14" fill={faint} />
      {children}
    </>
  );
}

const Bar = ({ x, y, w, h = 6, c = faint }: { x: number; y: number; w: number; h?: number; c?: string }) => (
  <rect x={x} y={y} width={w} height={h} fill={c} />
);

function Dashboard() {
  const bars = [60, 92, 74, 120, 98, 140, 112];
  return (
    <Chrome>
      <rect x="0" y="30" width="110" height="370" fill="#0B0D10" />
      <line x1="110" y1="30" x2="110" y2="400" stroke={line} />
      <rect x="16" y="52" width="14" height="14" fill={L} />
      {[0, 1, 2, 3, 4].map((i) => (
        <Bar key={i} x={16} y={88 + i * 26} w={i === 1 ? 70 : 56} c={i === 1 ? "rgba(198,245,90,0.35)" : faint} />
      ))}
      <Bar x={134} y={52} w={120} h={10} c={dim} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={134 + i * 160} y={84} width="146" height="64" fill="#171B21" stroke={line} />
          <Bar x={146 + i * 160} y={98} w={50} />
          <Bar x={146 + i * 160} y={116} w={70} h={14} c={i === 0 ? L : dim} />
        </g>
      ))}
      <rect x="134" y="164" width="306" height="210" fill="#171B21" stroke={line} />
      <Bar x={150} y={180} w={90} c={dim} />
      {bars.map((h, i) => (
        <rect key={i} x={156 + i * 40} y={350 - h} width="22" height={h} fill={i === 5 ? L : "rgba(245,245,240,0.16)"} />
      ))}
      <line x1="150" y1="350" x2="430" y2="350" stroke={line} />
      <rect x="454" y="164" width="172" height="210" fill="#171B21" stroke={line} />
      <Bar x={470} y={180} w={70} c={dim} />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect x={470} y={206 + i * 32} width="8" height="8" fill={i === 0 ? L : dim} />
          <Bar x={488} y={207 + i * 32} w={110 - i * 10} />
        </g>
      ))}
    </Chrome>
  );
}

function Storefront() {
  return (
    <Chrome>
      <Bar x={30} y={50} w={60} h={8} c={P} />
      {[0, 1, 2, 3].map((i) => (
        <Bar key={i} x={420 + i * 50} y={52} w={34} />
      ))}
      <line x1="0" y1="76" x2="640" y2="76" stroke={line} />
      <Bar x={30} y={98} w={220} h={14} c={P} />
      <Bar x={30} y={120} w={140} h={14} c={L} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={30 + i * 150} y={166} width="134" height="150" fill="#171B21" stroke={line} />
          <path
            d={`M${30 + i * 150 + 67} 196 l32 32 l-32 32 l-32 -32 Z`}
            fill={i === 1 ? L : "none"}
            stroke={i === 1 ? L : dim}
          />
          <Bar x={30 + i * 150} y={326} w={90} c={dim} />
          <Bar x={30 + i * 150} y={342} w={44} c={i === 1 ? L : faint} />
        </g>
      ))}
      <rect x="30" y="366" width="96" height="20" fill={L} />
    </Chrome>
  );
}

function Workflow() {
  const nodes = [
    { x: 40, y: 150, t: "Intake" },
    { x: 220, y: 90, t: "Validate" },
    { x: 220, y: 230, t: "Store" },
    { x: 410, y: 90, t: "Route" },
    { x: 410, y: 230, t: "Notify" },
  ];
  return (
    <Chrome>
      <g stroke={dim} fill="none" strokeWidth="1.2">
        <path d="M160 180 C190 180 190 120 220 120" />
        <path d="M160 180 C190 180 190 260 220 260" />
        <path d="M340 120 H410" />
        <path d="M340 260 C375 260 375 260 410 260" />
        <path d="M530 120 C570 120 570 180 570 220" strokeDasharray="4 4" />
      </g>
      {nodes.map((n, i) => (
        <g key={n.t}>
          <rect x={n.x} y={n.y} width="120" height="60" fill="#171B21" stroke={i === 3 ? L : line} />
          <rect x={n.x + 12} y={n.y + 14} width="8" height="8" fill={i === 3 ? L : dim} />
          <Bar x={n.x + 28} y={n.y + 14} w={56} c={P} />
          <Bar x={n.x + 12} y={n.y + 36} w={80} />
        </g>
      ))}
      <rect x="520" y="222" width="100" height="60" fill="#171B21" stroke={line} />
      <Bar x={532} y={238} w={60} c={dim} />
      <Bar x={532} y={256} w={40} c={L} />
      <rect x="40" y="330" width="580" height="44" fill="#0B0D10" stroke={line} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <Bar x={56 + i * 140} y={348} w={90} />
        </g>
      ))}
    </Chrome>
  );
}

function Website() {
  return (
    <Chrome>
      <Bar x={30} y={48} w={50} h={8} c={P} />
      {[0, 1, 2].map((i) => (
        <Bar key={i} x={470 + i * 50} y={50} w={34} />
      ))}
      <Bar x={60} y={120} w={330} h={22} c={P} />
      <Bar x={60} y={152} w={250} h={22} c={P} />
      <Bar x={60} y={196} w={290} />
      <Bar x={60} y={210} w={240} />
      <rect x="60" y="240" width="108" height="30" fill={L} />
      <rect x="180" y="240" width="108" height="30" fill="none" stroke={dim} />
      <rect x="430" y="100" width="170" height="190" fill="#171B21" stroke={line} />
      <path d="M515 140 l36 40 l-36 40 l-36 -40 Z" stroke={L} fill="none" strokeWidth="1.5" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={60 + i * 180} y={320} width="160" height="56" fill="#171B21" stroke={line} />
          <Bar x={74 + i * 180} y={336} w={60} c={dim} />
          <Bar x={74 + i * 180} y={352} w={110} />
        </g>
      ))}
    </Chrome>
  );
}

function Saas() {
  return (
    <Chrome>
      <Bar x={30} y={50} w={80} h={8} c={P} />
      <rect x="500" y="46" width="110" height="18" fill={L} />
      <Bar x={30} y={90} w={110} h={12} c={dim} />
      <rect x="30" y="120" width="580" height="30" fill="#171B21" stroke={line} />
      {["Invoice", "Client", "Amount", "Status"].map((_, i) => (
        <Bar key={i} x={44 + i * 140} y={132} w={60} c={dim} />
      ))}
      {[0, 1, 2, 3, 4].map((r) => (
        <g key={r}>
          <line x1="30" y1={176 + r * 38} x2="610" y2={176 + r * 38} stroke={line} />
          <Bar x={44} y={158 + r * 38} w={50} />
          <Bar x={184} y={158 + r * 38} w={80} />
          <Bar x={324} y={158 + r * 38} w={46} c={dim} />
          <rect x={464} y={154 + r * 38} width="52" height="14" fill={r % 2 === 0 ? "rgba(198,245,90,0.25)" : faint} stroke={r % 2 === 0 ? L : line} />
        </g>
      ))}
      <rect x="30" y="360" width="580" height="1" fill={line} />
    </Chrome>
  );
}

const map = { dashboard: Dashboard, storefront: Storefront, workflow: Workflow, website: Website, saas: Saas };

/** Generated UI preview. Replace with real screenshots via `images` on a project. */
export function ProjectVisual({
  kind,
  className = "",
  viewBox = "0 0 640 400",
}: {
  kind: ProjectVisualKind;
  className?: string;
  viewBox?: string;
}) {
  const Art = map[kind];
  return (
    <svg
      viewBox={viewBox}
      className={`block h-full w-full ${className}`}
      role="presentation"
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      <Art />
    </svg>
  );
}
