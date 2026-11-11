import type { Metadata } from "next";
import { WorkGrid } from "@/components/work/WorkGrid";
import { CtaBand } from "@/components/ui/CtaBand";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Work",
  description:
    "Selected concept and demonstration projects from NMN.DEV: websites, web apps, e-commerce, SaaS and automation, each with its challenge, solution and features.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="bg-grid absolute inset-0" />
        <div className="container-x relative pb-16 pt-16 md:pb-24 md:pt-28">
          <p className="label fade-in flex items-center gap-3">
            <span aria-hidden className="inline-block h-px w-8 bg-lime" />
            Work
          </p>
          <h1 className="display mt-7 max-w-5xl text-[clamp(2.5rem,8vw,6.5rem)]">
            <span className="mask-line"><span style={{ ["--d" as string]: "0.05s" }}>Projects, built</span></span>
            <span className="mask-line text-lime"><span style={{ ["--d" as string]: "0.15s" }}>with purpose.</span></span>
          </h1>
          <p className="fade-in mt-8 max-w-xl text-lg leading-relaxed text-muted" style={{ ["--d" as string]: "0.45s" }}>
            These are concept and demonstration projects that show how we think about structure,
            interface and engineering. Each one is labelled honestly, and real client work will
            replace them as it is published.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24" aria-label="Projects">
        <div className="container-x">
          <WorkGrid />
        </div>
      </section>

      <CtaBand
        title="Want to see yours here? Let's build it."
        description="Tell us what you're working on and we'll outline how we'd approach it."
      />
    </>
  );
}
