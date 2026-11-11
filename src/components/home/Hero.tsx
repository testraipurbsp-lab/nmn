import { ButtonLink } from "@/components/ui/Button";
import { HeroVisual } from "./HeroVisual";
import { HeroGlow } from "./HeroGlow";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div aria-hidden className="bg-grid absolute inset-0" />
      <HeroGlow />
      <div aria-hidden className="ambient pointer-events-none absolute -left-40 top-0 size-[520px] opacity-60" />

      <div className="container-x relative grid items-center gap-10 pb-20 pt-12 md:pb-28 md:pt-16 lg:grid-cols-12 lg:gap-6 lg:pb-28 lg:pt-16">
        <div className="relative z-10 lg:col-span-7">
          <p className="label fade-in flex items-center gap-3" style={{ ["--d" as string]: "0s" }}>
            <span aria-hidden className="inline-block h-px w-8 bg-lime" />
            Independent software development studio
          </p>

          <h1
            className="display mt-7 text-[clamp(2.8rem,14.5vw,5.5rem)] lg:text-[clamp(3.5rem,8vw,6.5rem)]"
            aria-label="Digital Experiences. Engineered to Perform."
          >
            <span className="mask-line" aria-hidden>
              <span style={{ ["--d" as string]: "0.1s" }}>Digital</span>
            </span>
            <span className="mask-line" aria-hidden>
              <span style={{ ["--d" as string]: "0.18s" }}>Experiences.</span>
            </span>
            <span className="mask-line text-lime" aria-hidden>
              <span style={{ ["--d" as string]: "0.28s" }}>Engineered</span>
            </span>
            <span className="mask-line text-lime" aria-hidden>
              <span style={{ ["--d" as string]: "0.36s" }}>to Perform.</span>
            </span>
          </h1>

          <p
            className="fade-in mt-8 max-w-xl text-lg leading-relaxed text-muted md:text-xl"
            style={{ ["--d" as string]: "0.7s" }}
          >
            We design and build high-performance websites, custom software, and powerful web
            applications that help businesses move forward.
          </p>

          <div className="fade-in mt-10 flex flex-col gap-3 sm:flex-row" style={{ ["--d" as string]: "0.85s" }}>
            <ButtonLink href="/contact">Start a Project</ButtonLink>
            {/* <ButtonLink href="/work" variant="secondary">
              Explore Our Work
            </ButtonLink> */}
          </div>

          <p
            className="fade-in mt-10 inline-flex items-center gap-3 text-sm text-muted"
            style={{ ["--d" as string]: "1s" }}
          >
            <span className="relative flex size-2.5">
              <span className="animate-pulse-ring absolute inset-0 rounded-full bg-lime" />
              <span className="relative size-2.5 rounded-full bg-lime" />
            </span>
            Available for select projects
          </p>
        </div>

        <div className="relative lg:col-span-5">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
