import type { ReactNode } from "react";

export function LegalPage({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <>
      <section className="border-b border-line">
        <div className="container-x pb-14 pt-16 md:pb-20 md:pt-28">
          <p className="label">Legal · Last updated {updated}</p>
          <h1 className="display mt-6 text-[clamp(2.4rem,7vw,5.5rem)]">{title}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{intro}</p>
        </div>
      </section>
      <div className="container-x py-14 md:py-20">
        <div className="prose-legal max-w-3xl">{children}</div>
      </div>
    </>
  );
}
