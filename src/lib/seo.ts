import type { Metadata } from "next";
import { site } from "@/config/site";

type Options = { title: string; description: string; path: string; noIndex?: boolean };

/** Per-page metadata with canonical, Open Graph and Twitter tags. */
export function buildMetadata({ title, description, path, noIndex }: Options): Metadata {
  const url = `${site.url}${path === "/" ? "" : path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url,
      siteName: site.name,
      locale: site.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description,
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
