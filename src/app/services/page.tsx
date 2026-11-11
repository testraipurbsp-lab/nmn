import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/config/site";
import { services } from "@/data/services";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Services",
  description:
    "Website development, custom software, web applications, e-commerce, SaaS and API automation. See what NMN.DEV builds, the problems it solves, and what you receive.",
  path: "/services",
});

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="label">{title}</h4>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-paper/90">
            <span aria-hidden className="mt-[0.7em] size-1 shrink-0 bg-lime" />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ServicesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": services.map((s) => ({
      "@type": "Service",
      name: s.title,
      description: s.overview,
      url: `${site.url}/services#${s.slug}`,
      provider: { "@type": "Organization", name: site.name, url: site.url },
    })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="bg-grid absolute inset-0" />
        <div className="container-x relative pb-20 pt-16 md:pb-28 md:pt-28">
          <p className="label fade-in flex items-center gap-3">
            <span aria-hidden className="inline-block h-px w-8 bg-lime" />
            Services
          </p>
          <h1 className="display mt-7 max-w-5xl text-[clamp(2.5rem,8vw,6.5rem)]">
            <span className="mask-line"><span style={{ ["--d" as string]: "0.05s" }}>Digital Solutions.</span></span>
            <span className="mask-line text-lime"><span style={{ ["--d" as string]: "0.15s" }}>Built Around</span></span>
            <span className="mask-line text-lime"><span style={{ ["--d" as string]: "0.25s" }}>Your Business.</span></span>
          </h1>
          <p className="fade-in mt-8 max-w-xl text-lg leading-relaxed text-muted" style={{ ["--d" as string]: "0.5s" }}>
            Websites, software and automation, from a landing page to a full product. Every engagement
            includes maintenance and technical support after launch.
          </p>

          <nav aria-label="Jump to service" className="fade-in mt-12 flex flex-wrap gap-2" style={{ ["--d" as string]: "0.65s" }}>
            {services.map((s) => (
              <a
                key={s.slug}
                href={`#${s.slug}`}
                className="border border-line px-3.5 py-2 text-sm text-muted transition-colors hover:border-lime hover:text-lime"
              >
                {s.title}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {services.map((s) => (
        <section
          key={s.slug}
          id={s.slug}
          aria-labelledby={`${s.slug}-title`}
          className="scroll-mt-20 border-b border-line py-20 md:py-28"
        >
          <div className="container-x grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-32">
                <Reveal>
                  <div className="flex items-center gap-4 text-lime">
                    <ServiceIcon name={s.icon} className="size-9" />
                    <span className="font-mono text-sm text-muted">{s.number}</span>
                  </div>
                  <h2 id={`${s.slug}-title`} className="h-section mt-6">{s.title}</h2>
                  <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">{s.overview}</p>
                  <ButtonLink
                    href={`/contact?service=${encodeURIComponent(s.formValue)}`}
                    className="mt-8"
                  >
                    Discuss {s.title}
                  </ButtonLink>
                </Reveal>
              </div>
            </div>

            <Reveal className="grid gap-12 sm:grid-cols-2 lg:col-span-7">
              <List title="Problems it solves" items={s.problems} />
              <List title="Key capabilities" items={s.capabilities} />
              <List title="Deliverables" items={s.deliverables} />
              <div>
                <h4 className="label">Relevant technologies</h4>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {s.technologies.map((t) => (
                    <li key={t} className="border border-line px-3 py-1.5 font-mono text-xs text-muted">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>
      ))}

      <CtaBand
        title="Not sure which service fits? Start with the problem."
        description="Describe what you're trying to achieve and we'll recommend the simplest approach that gets you there."
        cta="Send a project inquiry"
      />
    </>
  );
}
