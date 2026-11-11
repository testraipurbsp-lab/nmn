import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { SpotlightLink } from "@/components/motion/SpotlightLink";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { services } from "@/data/services";

export function ServicesGrid() {
  return (
    <section className="border-y border-line bg-surface py-24 md:py-32" aria-labelledby="services-title">
      <div className="container-x">
        <SectionHeader
          label="What we do"
          title="Everything You Need to Build Your Digital Future."
        />
        <h2 id="services-title" className="sr-only">Services</h2>

        <ul className="mt-16 grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal as="li" key={s.slug} delay={(i % 3) * 0.07} className="border-b border-r border-line">
              <SpotlightLink
                href={`/services#${s.slug}`}
                className="group relative flex h-full min-h-[280px] flex-col p-7 transition-colors duration-500 hover:bg-elevated md:p-9"
              >
                <span aria-hidden className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-lime transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
                <div className="flex items-start justify-between">
                  <span className="text-muted transition-colors duration-300 group-hover:text-lime">
                    <ServiceIcon name={s.icon} className="size-8" />
                  </span>
                  <span className="font-mono text-xs text-muted">{s.number}</span>
                </div>
                <h3 className="mt-auto pt-14 text-2xl font-medium tracking-[-0.03em]">{s.title}</h3>
                <p className="mt-3 max-w-xs leading-relaxed text-muted lg:min-h-[4.9rem]">{s.summary}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm text-paper/70 transition-colors group-hover:text-lime">
                  Learn more
                  <ArrowUpRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </SpotlightLink>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
