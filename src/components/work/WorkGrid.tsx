"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProjectCard } from "./ProjectCard";
import { projectCategories, projects, type ProjectCategory } from "@/data/projects";

export function WorkGrid() {
  const [active, setActive] = useState<"All" | ProjectCategory>("All");

  // Only offer categories that have at least one project.
  const categories = useMemo(
    () => projectCategories.filter((c) => c === "All" || projects.some((p) => p.category === c)),
    [],
  );
  const visible = projects.filter((p) => active === "All" || p.category === active);

  return (
    <div>
      <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
        {categories.map((c) => {
          const on = c === active;
          return (
            <button
              key={c}
              type="button"
              aria-pressed={on}
              onClick={() => setActive(c)}
              className={`border px-4 py-2 text-sm transition-colors duration-200 ${
                on ? "border-lime bg-lime text-ink" : "border-line text-muted hover:border-line-strong hover:text-paper"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
      </p>

      <motion.ul layout className="mt-12 grid gap-x-8 gap-y-16 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {visible.map((p) => (
            <motion.li
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProjectCard project={p} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
