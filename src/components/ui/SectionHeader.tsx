import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";

type Props = {
  label: string;
  title: ReactNode;
  description?: ReactNode;
  as?: "h1" | "h2";
  className?: string;
};

export function SectionHeader({ label, title, description, as: Tag = "h2", className = "" }: Props) {
  return (
    <div className={`max-w-4xl ${className}`}>
      <Reveal>
        <p className="label flex items-center gap-3">
          <span aria-hidden className="inline-block h-px w-8 bg-lime" />
          {label}
        </p>
      </Reveal>
      {typeof title === "string" ? (
        <SplitHeading as={Tag} text={title} className="h-section mt-6" delay={0.05} />
      ) : (
        <Reveal delay={0.08}>
          <Tag className="h-section mt-6">{title}</Tag>
        </Reveal>
      )}
      {description && (
        <Reveal delay={0.16}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{description}</p>
        </Reveal>
      )}
    </div>
  );
}
