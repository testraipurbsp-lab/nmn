import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-md px-6 py-3.5 text-[0.95rem] font-medium tracking-[-0.01em] transition-[background-color,border-color,color,box-shadow] duration-300 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-lime text-ink hover:bg-[#d4ff6e] hover:shadow-[0_0_0_6px_var(--color-glow)]",
  secondary:
    "border border-line-strong text-paper hover:border-lime hover:text-lime",
  ghost: "text-paper hover:text-lime px-0 py-0",
};

export function buttonStyles(variant: Variant = "primary", className = "") {
  return `${base} ${variants[variant]} ${className}`;
}

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: Variant;
  className?: string;
  arrow?: boolean;
};

export function ButtonLink({
  variant = "primary",
  className,
  arrow = true,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={buttonStyles(variant, className)} {...props}>
      {children}
      {arrow && (
        <ArrowUpRight
          aria-hidden
          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      )}
    </Link>
  );
}
