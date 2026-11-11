import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { CtaBand } from "@/components/ui/CtaBand";
import { aboutPrinciples } from "@/data/home";
import { LogoMark } from "@/components/brand/Logo";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "NMN.DEV is an independent software development brand focused on well-engineered, useful digital products. Learn how we think about quality and detail.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="bg-grid absolute inset-0" />
        <div className="container-x relative grid items-center gap-12 pb-20 pt-16 md:pb-28 md:pt-28 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="label fade-in flex items-center gap-3">
              <span aria-hidden className="inline-block h-px w-8 bg-lime" />
              About
            </p>
            <h1 className="display mt-7 text-[clamp(2.5rem,8vw,6.5rem)]">
              <span className="mask-line"><span style={{ ["--d" as string]: "0.05s" }}>Engineering Better</span></span>
              <span className="mask-line text-lime"><span style={{ ["--d" as string]: "0.15s" }}>Digital Experiences.</span></span>
            </h1>
          </div>
          <div className="fade-in hidden justify-self-end lg:col-span-4 lg:block" style={{ ["--d" as string]: "0.5s" }}>
            <LogoMark size={200} />
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32" aria-labelledby="who">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <h2 id="who" className="label">Who we are</h2>
          </Reveal>
          <Reveal className="space-y-6 lg:col-span-7" delay={0.08}>
            <p className="text-2xl leading-snug tracking-[-0.02em] md:text-3xl">
              NMN.DEV is an independent software development brand that builds websites, custom
              software and web applications for businesses.
            </p>
            <p className="max-w-2xl text-lg leading-relaxed text-muted">
              We work directly with the people who own the problem. That keeps communication short,
              decisions quick, and the person you talk to the person who builds the product.
            </p>
            <p className="max-w-2xl text-lg leading-relaxed text-muted">
              Our focus is simple: understand what a business needs, then design and engineer
              something useful, fast, and easy to maintain.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-line bg-surface py-20 md:py-32" aria-labelledby="philosophy">
        <div className="container-x">
          <Reveal>
            <p className="label flex items-center gap-3">
              <span aria-hidden className="inline-block h-px w-8 bg-lime" />
              Philosophy
            </p>
            <h2 id="philosophy" className="h-section mt-6 max-w-3xl">
              Useful products come from careful work.
            </h2>
          </Reveal>

          <ul className="mt-14 grid border-l border-t border-line sm:grid-cols-2">
            {aboutPrinciples.map((p, i) => (
              <Reveal as="li" key={p.title} delay={(i % 2) * 0.08} className="border-b border-r border-line p-7 md:p-10">
                <h3 className="text-2xl font-medium tracking-[-0.03em]">{p.title}</h3>
                <p className="mt-3 max-w-sm leading-relaxed text-muted">{p.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20 md:py-32" aria-labelledby="approach">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <h2 id="approach" className="label">How we build</h2>
          </Reveal>
          <Reveal className="space-y-6 lg:col-span-7" delay={0.08}>
            <p className="max-w-2xl text-lg leading-relaxed text-muted">
              We choose proven, current technology (TypeScript, React, Next.js, Node.js, Python and
              PostgreSQL among them) and use it conservatively. The aim is software that is fast
              for users and straightforward for the next developer to understand.
            </p>
            <p className="max-w-2xl text-lg leading-relaxed text-muted">
              Accessibility, performance and security are part of the build, not a final pass.
              Forms are validated on the server, secrets stay out of the browser, and pages are
              measured rather than assumed to be fast.
            </p>
            <p className="max-w-2xl text-lg leading-relaxed text-muted">
              You get the source code, documentation and a clear way to run and deploy what we
              build.
            </p>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Let's talk about what you're building."
        description="Share the idea, the problem or the rough scope. We'll reply with honest, practical next steps."
        cta="Start a project"
      />
    </>
  );
}
