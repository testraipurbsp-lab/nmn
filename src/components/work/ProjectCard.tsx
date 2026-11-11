import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { statusLabel, type Project } from "@/data/projects";
import { ProjectVisual } from "./ProjectVisual";

type Props = {
  project: Project;
  /** Large editorial layout used on the homepage. */
  featured?: boolean;
  priority?: boolean;
};

export function ProjectPreview({ project, className = "" }: { project: Project; className?: string }) {
  const img = project.images?.[0];
  return (
    <div className={`relative aspect-[16/10] overflow-hidden border border-line bg-surface ${className}`}>
      <div className="size-full origin-center transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]">
        {img ? (
          <Image src={img.src} alt={img.alt} width={img.width} height={img.height} className="size-full object-cover" sizes="(min-width: 1024px) 60vw, 100vw" />
        ) : (
          <ProjectVisual kind={project.visual} />
        )}
      </div>
      <div aria-hidden className="absolute inset-0 bg-lime/0 mix-blend-overlay transition-colors duration-500 group-hover:bg-lime/10" />
      <span className="absolute right-2 top-1.5 border border-line-strong bg-ink/80 px-2 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-muted backdrop-blur">
        {statusLabel[project.status]}
      </span>
    </div>
  );
}

export function ProjectCard({ project, featured = false }: Props) {
  return (
    <article className="group relative">
      <Link href={`/work/${project.slug}`} className="block" aria-label={`${project.name}: view project`}>
        <ProjectPreview project={project} />
        <div className={`mt-5 flex items-start justify-between gap-6 ${featured ? "md:mt-6" : ""}`}>
          <div>
            <p className="label">{project.category}</p>
            <h3 className="mt-2 text-2xl font-medium tracking-[-0.03em] md:text-3xl">{project.name}</h3>
            <p className="mt-2 max-w-md text-muted">{project.summary}</p>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies">
              {project.technologies.map((t) => (
                <li key={t} className="border border-line px-2.5 py-1 font-mono text-[0.68rem] text-muted">
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <span className="mt-1 inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-line-strong text-paper transition-colors duration-300 group-hover:border-lime group-hover:bg-lime group-hover:text-ink">
            <ArrowUpRight aria-hidden className="size-5" />
          </span>
        </div>
      </Link>
    </article>
  );
}
