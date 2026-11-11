import { technologies } from "@/data/home";
import { services } from "@/data/services";

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden} className="flex shrink-0 items-center gap-10 pr-10">
      {technologies.map((t) => (
        <li
          key={t.name}
          className="flex items-center gap-10 whitespace-nowrap text-2xl font-medium tracking-[-0.03em] text-paper/80 md:text-3xl"
        >
          {t.name}
          <span aria-hidden className="size-1.5 rotate-45 bg-lime" />
        </li>
      ))}
    </ul>
  );
}

function ServiceRow() {
  return (
    <ul className="flex shrink-0 items-center gap-10 pr-10">
      {services.map((s) => (
        <li key={s.slug} className="flex items-center gap-10 whitespace-nowrap">
          <span className="outline-text text-3xl font-semibold uppercase tracking-[-0.02em] md:text-5xl">
            {s.title}
          </span>
          <span aria-hidden className="size-1.5 rounded-full bg-lime" />
        </li>
      ))}
    </ul>
  );
}

/** Two endless tickers: technologies (left) and services (reverse, outlined). */
export function Marquee() {
  return (
    <section
      aria-label="Technologies we work with"
      className="marquee-wrap overflow-hidden border-b border-line py-7"
    >
      <div className="marquee flex w-max">
        <Row />
        <Row hidden />
      </div>
      <div aria-hidden className="marquee marquee-rev mt-4 flex w-max">
        <ServiceRow />
        <ServiceRow />
      </div>
    </section>
  );
}