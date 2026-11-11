import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { introPillars } from "@/data/home";

export function Intro() {
  return (
    <section className="py-24 md:py-36" aria-labelledby="intro-title">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <SplitHeading id="intro-title" text="More Than Just Development." className="h-section" />
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-muted">
              Every business has a different challenge. We combine thoughtful design, engineering,
              and technology to create digital solutions built around your goals.
            </p>
          </Reveal>
        </div>

        <ol className="lg:col-span-6 lg:col-start-7">
          {introPillars.map((p, i) => (
            <Reveal as="li" key={p.number} delay={i * 0.08} className="grid grid-cols-[3.5rem_1fr] gap-4 border-t border-line py-8 first:border-t-0 first:pt-0 md:grid-cols-[5rem_1fr]">
              <span className="font-mono text-sm text-lime">{p.number}</span>
              <div>
                <h3 className="text-2xl font-medium tracking-[-0.03em] md:text-3xl">{p.title}</h3>
                <p className="mt-2 max-w-sm text-muted">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
