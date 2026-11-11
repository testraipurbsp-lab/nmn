# NMN.DEV

Marketing site for NMN.DEV, an independent software development studio.
Built with Next.js (App Router), TypeScript, Tailwind CSS v4, Framer Motion, React Hook Form and Zod.

## Setup

Requires Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env.local   # then fill in the values (see below)
```

## Commands

| Command             | What it does                    |
| ------------------- | ------------------------------- |
| `npm run dev`       | Development server on :3000     |
| `npm run build`     | Production build                |
| `npm run start`     | Serve the production build      |
| `npm run lint`      | ESLint                          |
| `npm run typecheck` | TypeScript check                |

## Environment variables

See `.env.example`. Nothing is invented: blank contact details and social links are simply hidden.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical URL, sitemap, Open Graph (default `https://nmn.dev`) |
| `NEXT_PUBLIC_CONTACT_EMAIL`, `_PHONE`, `NEXT_PUBLIC_LOCATION` | No | Shown in footer, contact page and privacy policy when set |
| `NEXT_PUBLIC_INSTAGRAM_URL`, `_GITHUB_URL`, `_LINKEDIN_URL` | No | Social links. Instagram defaults to `instagram.com/nmn.dev`; GitHub and LinkedIn are hidden until set |
| `RESEND_API_KEY` | **Yes, for the form** | Resend API key (server only) |
| `CONTACT_FROM_EMAIL` | **Yes, for the form** | Verified sender, e.g. `NMN.DEV <hello@nmn.dev>` |
| `CONTACT_TO_EMAIL` | **Yes, for the form** | Inbox that receives inquiries |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Recommended | Cloudflare Turnstile spam check. Enabled only when the secret is set |

## Contact form

The form posts to `/api/contact`, which validates input with Zod on the server, applies a honeypot, a same-origin check, a body-size limit and a rate limit (5 per 10 minutes per IP), optionally verifies Turnstile, and sends the email with Resend.

**Until `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` and `CONTACT_TO_EMAIL` are set, the API returns a 503 and the form shows an error. It never reports a message as sent when it was not.**

To enable delivery:

1. Create a Resend account and verify your sending domain (`nmn.dev`).
2. Create an API key and set the three variables above.
3. Optional: create a Cloudflare Turnstile widget and set both Turnstile keys.

The rate limiter is in-memory, so on serverless hosting each instance counts separately. Turnstile covers that gap; for stricter limits swap `src/lib/rate-limit.ts` for a shared store such as Upstash Redis.

## Editing content

| What | Where |
| --- | --- |
| Brand, contact, socials | `src/config/site.ts` |
| Navigation | `src/config/navigation.ts` |
| Services, budget and timeline options | `src/data/services.ts` |
| Process, differentiators, technologies, about principles | `src/data/home.ts` |
| Projects | `src/data/projects.ts` |
| Colours and type | `src/app/globals.css` (`@theme`) |

### Replacing demo projects with real ones

The five projects are clearly labelled **concept** or **demo**. To add a real project, add an entry to `src/data/projects.ts`, set `status: "client"`, put screenshots in `public/projects/` and list them in `images`. Detail pages, filters and the sitemap update automatically. Remove the placeholder entries when you are ready.

## Deployment

Works on any Node host. On Vercel: import the repository, add the environment variables, deploy. Elsewhere: `npm run build && npm run start`.

Before launch:

- Set `NEXT_PUBLIC_SITE_URL` and the email variables.
- Add real contact details and GitHub / LinkedIn URLs.
- Review the Privacy Policy and Terms with a qualified adviser. They are sensible starting drafts, not legal advice.
- Submit `/sitemap.xml` to Google Search Console.

## Security

Security headers are set in `next.config.ts`. Input is validated and sanitised on the server, email content is HTML-escaped, JSON-LD is escaped, and secrets are only read on the server.

## Logo

The logo is an SVG recreation of the NMN mark (`src/components/brand/Logo.tsx`, `src/app/icon.svg`) built from the brand description. To use your original artwork, replace those two files with your exported SVG.
