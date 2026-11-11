import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { technologies } from "@/data/home";

export function TechStack() {
  return (
    <section className="border-t border-line bg-surface py-24 md:py-32" aria-labelledby="tech-title">
      <div className="container-x">
        <Reveal>
          <p className="label flex items-center gap-3">
            <span aria-hidden className="inline-block h-px w-8 bg-lime" />
            Technology
          </p>
        </Reveal>
        <SplitHeading id="tech-title" text="Built With Modern Technology." className="h-section mt-6 max-w-3xl" delay={0.05} />

        <ul className="mt-14 grid grid-cols-2 border-l border-t border-line md:grid-cols-5">
          {technologies.map((t, i) => (
            <Reveal as="li" key={t.name} delay={(i % 5) * 0.04} className="border-b border-r border-line">
              <div className="group flex h-full min-h-[120px] flex-col justify-between p-5 transition-colors duration-300 hover:bg-elevated">
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted">{t.group}</span>
                <span className="mt-6 text-lg font-medium tracking-[-0.02em] transition-colors group-hover:text-lime md:text-xl">
                  {t.name}
                </span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
