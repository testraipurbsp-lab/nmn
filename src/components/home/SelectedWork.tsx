import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectCard } from "@/components/work/ProjectCard";
import { projects } from "@/data/projects";

export function SelectedWork() {
  const featured = projects.slice(0, 3);
  return (
    <section className="py-24 md:py-36" aria-label="Selected projects">
      <div className="container-x">
        <SectionHeader
          label="Selected projects"
          title="Built With Purpose. Designed to Make an Impact."
          description="Concept and demonstration projects that show how we approach structure, interface and engineering. They are labelled honestly and are easy to swap for client work."
        />

        <div className="mt-16 space-y-20 md:mt-24 md:space-y-32">
          {featured.map((project, i) => {
            const flip = i % 2 === 1;
            return (
              <Reveal key={project.slug} className="grid items-end gap-8 md:grid-cols-12 md:gap-10">
                <div className={`md:col-span-8 ${flip ? "md:col-start-5" : "md:col-start-1"} md:row-start-1`}>
                  <ProjectCard project={project} featured />
                </div>
                <div
                  className={`hidden border-l border-line pl-6 md:col-span-3 md:row-start-1 md:block ${
                    flip ? "md:col-start-1" : "md:col-start-10"
                  }`}
                >
                  <p className="label">Overview</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{project.overview}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-line pt-10 sm:flex-row sm:items-center">
          <p className="max-w-md text-muted">
            Have a project in mind?{" "}
            <Link href="/contact" className="text-paper underline decoration-lime underline-offset-4">
              Tell us about it.
            </Link>
          </p>
          <ButtonLink href="/work" variant="secondary">
            View all projects
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
