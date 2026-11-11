import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { site } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Tell NMN.DEV what you're building. Share your idea, challenge or vision and get a considered reply about how to bring it to life.",
  path: "/contact",
});

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string | string[] }>;
}) {
  const sp = await searchParams;
  const service = Array.isArray(sp.service) ? sp.service[0] : sp.service;
  const { email, phone, location } = site.contact;

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="bg-grid absolute inset-0 opacity-70" />
      <div className="container-x relative grid gap-16 pb-24 pt-16 md:pb-32 md:pt-28 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="label fade-in flex items-center gap-3">
            <span aria-hidden className="inline-block h-px w-8 bg-lime" />
            Contact
          </p>
          <h1 className="display mt-7 text-[clamp(2.4rem,6.5vw,5rem)]">
            <span className="mask-line"><span style={{ ["--d" as string]: "0.05s" }}>Let&apos;s Talk</span></span>
            <span className="mask-line"><span style={{ ["--d" as string]: "0.13s" }}>About Your</span></span>
            <span className="mask-line text-lime"><span style={{ ["--d" as string]: "0.21s" }}>Next Project.</span></span>
          </h1>
          <p className="fade-in mt-8 max-w-md text-lg leading-relaxed text-muted" style={{ ["--d" as string]: "0.45s" }}>
            Tell us what you&apos;re building. Share your idea, challenge, or vision, and let&apos;s
            explore how we can bring it to life.
          </p>

          <dl className="fade-in mt-12 space-y-5 border-t border-line pt-8 text-sm" style={{ ["--d" as string]: "0.6s" }}>
            {email && (
              <div>
                <dt className="label">Email</dt>
                <dd className="mt-1.5"><a href={`mailto:${email}`} className="text-paper hover:text-lime">{email}</a></dd>
              </div>
            )}
            {phone && (
              <div>
                <dt className="label">Phone</dt>
                <dd className="mt-1.5"><a href={`tel:${phone.replace(/\s/g, "")}`} className="text-paper hover:text-lime">{phone}</a></dd>
              </div>
            )}
            {location && (
              <div>
                <dt className="label">Location</dt>
                <dd className="mt-1.5 text-paper">{location}</dd>
              </div>
            )}
            <div>
              <dt className="label">Instagram</dt>
              <dd className="mt-1.5">
                <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="text-paper hover:text-lime">
                  {site.handle}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-7">
          <div className="border border-line bg-surface/60 p-6 backdrop-blur-sm md:p-10">
            <ContactForm defaultService={service} turnstileSiteKey={site.turnstileSiteKey} />
          </div>
        </div>
      </div>
    </section>
  );
}
