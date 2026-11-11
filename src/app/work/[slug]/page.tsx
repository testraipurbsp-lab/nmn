import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { CtaBand } from "@/components/ui/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProjectPreview } from "@/components/work/ProjectCard";
import { ProjectVisual } from "@/components/work/ProjectVisual";
import { site } from "@/config/site";
import { getProject, projects, statusLabel } from "@/data/projects";
import { buildMetadata } from "@/lib/seo";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return buildMetadata({
    title: `${project.name}: ${project.category}`,
    description: project.summary,
    path: `/work/${project.slug}`,
  });
}

const crops = ["0 0 320 200", "320 200 320 200", "0 200 320 200"];

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: project.summary,
    url: `${site.url}/work/${project.slug}`,
    creator: { "@type": "Organization", name: site.name, url: site.url },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <article>
        <header className="relative overflow-hidden border-b border-line">
          <div aria-hidden className="bg-grid absolute inset-0" />
          <div className="container-x relative pb-14 pt-10 md:pb-20 md:pt-16">
            <Link href="/work" className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-lime">
              <ArrowLeft aria-hidden className="size-4" /> All projects
            </Link>
            <p className="label mt-10">{project.category}</p>
            <h1 className="display mt-4 text-[clamp(3rem,10vw,8rem)]">{project.name}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{project.summary}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <span className="border border-line-strong px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-lime">
                {statusLabel[project.status]}
              </span>
              <ul className="flex flex-wrap gap-2" aria-label="Technologies">
                {project.technologies.map((t) => (
                  <li key={t} className="border border-line px-2.5 py-1 font-mono text-[0.68rem] text-muted">
                    {t}
                  </li>
                ))}
              </ul>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-paper hover:text-lime"
                >
                  Visit live site <ArrowUpRight aria-hidden className="size-4" />
                </a>
              )}
            </div>
          </div>
        </header>

        <div className="container-x py-12 md:py-20">
          <div className="group">
            <ProjectPreview project={project} className="!aspect-[16/9]" />
          </div>

          <div className="mt-20 grid gap-16 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <h2 className="label">Overview</h2>
              <p className="mt-4 text-xl leading-relaxed tracking-[-0.01em]">{project.overview}</p>
            </Reveal>

            <div className="grid gap-12 sm:grid-cols-2 lg:col-span-8">
              <Reveal>
                <h2 className="label">The challenge</h2>
                <p className="mt-4 leading-relaxed text-muted">{project.challenge}</p>
              </Reveal>
              <Reveal delay={0.08}>
                <h2 className="label">The solution</h2>
                <p className="mt-4 leading-relaxed text-muted">{project.solution}</p>
              </Reveal>
              <Reveal className="sm:col-span-2" delay={0.12}>
                <h2 className="label">Features</h2>
                <ul className="mt-4 grid gap-x-10 gap-y-3 sm:grid-cols-2">
                  {project.features.map((f) => (
                    <li key={f} className="flex gap-3 border-t border-line pt-3">
                      <span aria-hidden className="mt-[0.7em] size-1 shrink-0 bg-lime" />
                      {f}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>

          {!project.images?.length && (
            <Reveal className="mt-20">
              <h2 className="label">Interface details</h2>
              <ul className="mt-5 grid gap-4 sm:grid-cols-3">
                {crops.map((vb) => (
                  <li key={vb} className="aspect-[16/10] overflow-hidden border border-line">
                    <ProjectVisual kind={project.visual} viewBox={vb} />
                  </li>
                ))}
              </ul>
              <p className="mt-4 max-w-xl text-sm text-muted">
                Generated interface previews for a {project.status} project. Real screenshots can be
                added in <code className="font-mono text-paper/80">src/data/projects.ts</code>.
              </p>
            </Reveal>
          )}

          {project.images && project.images.length > 1 && (
            <Reveal className="mt-20">
              <h2 className="label">Screenshots</h2>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {project.images.slice(1).map((img) => (
                  <li key={img.src} className="overflow-hidden border border-line">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.src} alt={img.alt} width={img.width} height={img.height} loading="lazy" className="h-auto w-full" />
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>

        <aside className="border-t border-line" aria-label="Next project">
          <Link
            href={`/work/${next.slug}`}
            className="group container-x flex items-center justify-between gap-6 py-12 md:py-16"
          >
            <span>
              <span className="label">Next project</span>
              <span className="mt-2 block text-3xl font-medium tracking-[-0.03em] transition-colors group-hover:text-lime md:text-5xl">
                {next.name}
              </span>
            </span>
            <ArrowRight aria-hidden className="size-8 shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-lime" />
          </Link>
        </aside>
      </article>

      <CtaBand
        title="Have something like this in mind?"
        description="Share the idea and we'll outline how we would approach it."
        cta="Start a project"
      />
    </>
  );
}
