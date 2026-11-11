import Link from "next/link";
import { Github, Instagram, Linkedin } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { footerCompany, legalNav } from "@/config/navigation";
import { site } from "@/config/site";
import { services } from "@/data/services";

function Social({ href, label, children }: { href?: string; label: string; children: React.ReactNode }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex size-10 items-center justify-center rounded-md border border-line text-muted transition-colors hover:border-lime hover:text-lime"
    >
      {children}
    </a>
  );
}

export function Footer() {
  const { email, phone, location } = site.contact;
  const hasContact = Boolean(email || phone || location);

  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-x py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-6 max-w-sm leading-relaxed text-muted">{site.shortDescription}</p>
            <div className="mt-6 flex gap-3">
              <Social href={site.social.instagram} label={`Instagram ${site.handle}`}>
                <Instagram className="size-[18px]" />
              </Social>
              <Social href={site.social.github} label="GitHub">
                <Github className="size-[18px]" />
              </Social>
              <Social href={site.social.linkedin} label="LinkedIn">
                <Linkedin className="size-[18px]" />
              </Social>
            </div>
          </div>

          <nav aria-label="Footer company" className="md:col-span-2">
            <h2 className="label">Company</h2>
            <ul className="mt-5 space-y-3">
              {footerCompany.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-paper/90 transition-colors hover:text-lime">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer services" className="md:col-span-3">
            <h2 className="label">Services</h2>
            <ul className="mt-5 space-y-3">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services#${s.slug}`} className="text-paper/90 transition-colors hover:text-lime">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-2">
            <h2 className="label">Contact</h2>
            <ul className="mt-5 space-y-3 text-paper/90">
              {email && (
                <li>
                  <a href={`mailto:${email}`} className="break-all transition-colors hover:text-lime">
                    {email}
                  </a>
                </li>
              )}
              {phone && (
                <li>
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className="transition-colors hover:text-lime">
                    {phone}
                  </a>
                </li>
              )}
              {location && <li>{location}</li>}
              <li>
                <Link href="/contact" className="text-lime underline-offset-4 hover:underline">
                  Send an enquiry
                </Link>
              </li>
            </ul>
            {!hasContact && (
              <p className="mt-3 text-sm text-muted">Use the form and we&apos;ll reply by email.</p>
            )}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-6 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <ul className="flex gap-6">
            {legalNav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-paper">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
