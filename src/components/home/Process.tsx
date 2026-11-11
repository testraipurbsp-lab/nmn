import { Reveal } from "@/components/motion/Reveal";
import { ScrollLine } from "@/components/motion/ScrollLine";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { processSteps } from "@/data/home";

export function Process() {
  return (
    <section className="py-24 md:py-36" aria-label="Development process">
      <div className="container-x">
        <SectionHeader label="Process" title="From First Conversation to Final Deployment." />

        <div className="mt-16 md:mt-24">
          <ScrollLine className="hidden md:block" />
          <ol className="grid gap-0 md:grid-cols-5 md:gap-6">
            {processSteps.map((step, i) => (
              <Reveal
                as="li"
                key={step.number}
                delay={i * 0.1}
                className="relative border-l border-line py-6 pl-6 md:border-l-0 md:pl-0 md:pt-8"
              >
                <span aria-hidden className="absolute -left-[5px] top-8 size-2.5 bg-lime md:-top-[5px] md:left-0" />
                <span className="font-mono text-sm text-lime">{step.number}</span>
                <h3 className="mt-3 text-2xl font-medium tracking-[-0.03em]">{step.title}</h3>
                <p className="mt-2 max-w-[16rem] text-muted">{step.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
