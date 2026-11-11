import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { differentiators } from "@/data/home";
import { StackDiagram } from "./StackDiagram";

export function WhyNmn() {
  return (
    <section className="border-y border-line bg-surface py-24 md:py-36" aria-labelledby="why-title">
      <div className="container-x grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <p className="label flex items-center gap-3">
                <span aria-hidden className="inline-block h-px w-8 bg-lime" />
                Why NMN.DEV
              </p>
            </Reveal>
            <SplitHeading
              id="why-title"
              text="Good Code Is Expected. Great Execution Is the Difference."
              className="h-section mt-6"
              delay={0.05}
            />

            {/* technical element: layered stack diagram */}
            <StackDiagram />
          </div>
        </div>

        <ul className="lg:col-span-7">
          {differentiators.map((d, i) => (
            <Reveal as="li" key={d.title} delay={i * 0.06} className="group border-t border-line py-8 first:border-t-0 first:pt-0 md:py-10">
              <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between md:gap-10">
                <h3 className="text-2xl font-medium tracking-[-0.03em] transition-colors duration-300 group-hover:text-lime md:text-4xl">
                  {d.title}
                </h3>
                <span className="font-mono text-xs text-muted md:shrink-0">{d.spec}</span>
              </div>
              <p className="mt-3 max-w-lg text-muted">{d.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
