/**
 * Centralized brand + site configuration.
 * Contact details and social links come from environment variables so nothing
 * is invented. Blank values are hidden by the UI.
 */
const clean = (v: string | undefined) => (v && v.trim() ? v.trim() : undefined);

export const site = {
  name: "NMN.DEV",
  handle: "@nmn.dev",
  url: clean(process.env.NEXT_PUBLIC_SITE_URL) ?? "https://nmn.dev",
  tagline: "Digital Experiences. Engineered to Perform.",
  description:
    "NMN.DEV is an independent software development studio building high-performance websites, custom software, and web applications.",
  shortDescription:
    "An independent software studio turning business ideas into powerful digital products.",
  locale: "en_IN",
  contact: {
    email: clean(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
    phone: clean(process.env.NEXT_PUBLIC_CONTACT_PHONE),
    location: clean(process.env.NEXT_PUBLIC_LOCATION),
  },
  social: {
    instagram: clean(process.env.NEXT_PUBLIC_INSTAGRAM_URL) ?? "https://instagram.com/nmn.dev",
    github: clean(process.env.NEXT_PUBLIC_GITHUB_URL),
    linkedin: clean(process.env.NEXT_PUBLIC_LINKEDIN_URL),
  },
  turnstileSiteKey: clean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY),
} as const;

export const colors = {
  ink: "#0B0D10",
  paper: "#F5F5F0",
  lime: "#C6F55A",
} as const;
