import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ButtonLink } from "@/components/ui/Button";

type Props = {
  title?: string;
  description?: string;
  cta?: string;
  href?: string;
};

export function CtaBand({
  title = "Have an Idea? Let's Build Something Powerful.",
  description = "Whether you need a high-performing website, custom software, or a complete digital product, let's turn your vision into reality.",
  cta = "Start Your Project",
  href = "/contact",
}: Props) {
  return (
    <section className="relative overflow-hidden border-t border-line py-28 md:py-44" aria-label="Start a project">
      {/* geometric accent: nested diamonds echoing the logo */}
      <svg
        aria-hidden
        viewBox="0 0 600 600"
        className="pointer-events-none absolute -right-40 top-1/2 size-[640px] -translate-y-1/2 md:-right-20 md:size-[760px]"
        fill="none"
      >
        {[280, 210, 140, 70].map((r, i) => (
          <path
            key={r}
            d={`M300 ${300 - r} L${300 + r} 300 L300 ${300 + r} L${300 - r} 300 Z`}
            stroke={i === 3 ? "#C6F55A" : "rgba(198,245,90,0.2)"}
            strokeWidth="1"
            fill={i === 3 ? "rgba(198,245,90,0.08)" : "none"}
          />
        ))}
      </svg>
      <div aria-hidden className="ambient pointer-events-none absolute -right-20 top-1/2 size-[560px] -translate-y-1/2" />

      <div className="container-x relative">
        <SplitHeading text={title} className="display max-w-4xl text-[clamp(2.4rem,7vw,5.75rem)]" />
        <Reveal delay={0.1}>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">{description}</p>
        </Reveal>
        <Reveal delay={0.2} className="mt-10">
          <ButtonLink href={href}>{cta}</ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
