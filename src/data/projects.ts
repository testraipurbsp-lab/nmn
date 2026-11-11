export type ProjectCategory = "Websites" | "E-commerce" | "Web Apps" | "SaaS" | "Automation";
export type ProjectVisualKind = "dashboard" | "storefront" | "workflow" | "website" | "saas";

export type Project = {
  slug: string;
  name: string;
  category: ProjectCategory;
  /**
   * "concept" and "demo" are shown with an honest label in the UI.
   * Switch to "client" (and fill `url` / `image`) when you add a real project.
   */
  status: "concept" | "demo" | "client";
  summary: string;
  technologies: string[];
  overview: string;
  challenge: string;
  solution: string;
  features: string[];
  /** Generated visual used when no real screenshot is supplied. */
  visual: ProjectVisualKind;
  /** Optional real screenshots: place files in /public/projects and list them here. */
  images?: { src: string; alt: string; width: number; height: number }[];
  /** Optional live URL for real projects. */
  url?: string;
};

export const statusLabel: Record<Project["status"], string> = {
  concept: "Concept project",
  demo: "Demo project",
  client: "Client project",
};

export const projectCategories: ("All" | ProjectCategory)[] = [
  "All",
  "Websites",
  "Web Apps",
  "E-commerce",
  "SaaS",
  "Automation",
];

/**
 * Add real projects here. Everything below is a clearly labelled concept
 * used to show the kind of work NMN.DEV builds. No clients, results or
 * metrics are implied.
 */
export const projects: Project[] = [
  {
    slug: "atlas-operations-dashboard",
    name: "Atlas",
    category: "Web Apps",
    status: "concept",
    summary: "An operations dashboard that brings orders, stock and team tasks into one view.",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "REST APIs"],
    overview:
      "A concept for a small-business operations dashboard: one place to see what needs attention today, with role-based views for owners and staff.",
    challenge:
      "Operations data usually lives in spreadsheets, messaging apps and separate tools, so nobody has a reliable picture of what is late, low or blocked.",
    solution:
      "A single dashboard with a prioritised work queue, clear status states and filtered views per role, backed by a typed API and a relational data model.",
    features: [
      "Prioritised task and order queue",
      "Role-based access for owners and staff",
      "Searchable, filterable data tables",
      "Activity log for every change",
      "CSV export for reporting",
    ],
    visual: "dashboard",
  },
  {
    slug: "foundry-storefront",
    name: "Foundry",
    category: "E-commerce",
    status: "concept",
    summary: "A fast, editorial storefront focused on product discovery and a short checkout.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js"],
    overview:
      "A concept storefront for a small catalogue brand, designed to make browsing feel considered and checkout feel short.",
    challenge:
      "Many small stores use heavy templates that load slowly on mobile and look like every other shop, which weakens the brand and loses shoppers.",
    solution:
      "A lightweight, content-led storefront with large product imagery, quick filtering and a streamlined cart and checkout flow.",
    features: [
      "Product grid with fast filtering",
      "Product pages with variant selection",
      "Persistent cart and simple checkout",
      "Order confirmation emails",
      "Admin area for products and orders",
    ],
    visual: "storefront",
  },
  {
    slug: "relay-automation",
    name: "Relay",
    category: "Automation",
    status: "demo",
    summary: "An automation service that moves form enquiries into the tools a team already uses.",
    technologies: ["Node.js", "Python", "REST APIs", "PostgreSQL"],
    overview:
      "A demonstration of an integration service that receives events, validates them and routes them to other systems without manual copying.",
    challenge:
      "Enquiries arrive by form and email, then get copied by hand into a CRM and a task list, which is slow and easy to get wrong.",
    solution:
      "A small service that validates incoming events, stores them, and forwards them to the right destination with retries and failure alerts.",
    features: [
      "Webhook intake with validation",
      "Rule-based routing to destinations",
      "Retry handling and failure alerts",
      "Searchable event log",
      "Documented API",
    ],
    visual: "workflow",
  },
  {
    slug: "northline-business-site",
    name: "Northline",
    category: "Websites",
    status: "concept",
    summary: "A clean, fast marketing site for a professional services business.",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    overview:
      "A concept marketing website for a services firm, built to explain the offer quickly and make getting in touch the obvious next step.",
    challenge:
      "Service businesses often have sites that describe everything and prioritise nothing, so visitors leave without knowing what to do.",
    solution:
      "A focused structure: a clear statement of the offer, proof points to be filled with real material, and a short enquiry form on every page.",
    features: [
      "Clear service pages",
      "Fast, accessible, responsive layouts",
      "Enquiry form with validation",
      "Technical SEO and structured data",
      "Content easily replaced by the client",
    ],
    visual: "website",
  },
  {
    slug: "ledgerly-saas",
    name: "Ledgerly",
    category: "SaaS",
    status: "concept",
    summary: "A subscription SaaS concept for invoicing, with accounts, plans and billing built in.",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Cloud Platforms"],
    overview:
      "A concept SaaS product showing the architecture behind a multi-account subscription app: workspaces, plans and billing.",
    challenge:
      "Early products tend to skip account structure and billing, then need a painful rewrite once real customers arrive.",
    solution:
      "A workspace-based data model, role permissions and a billing layer designed in from the first version, with a dashboard on top.",
    features: [
      "Workspaces with team roles",
      "Plan and subscription handling",
      "Invoice creation and PDF export",
      "Customer-facing dashboard",
      "Admin tools for support",
    ],
    visual: "saas",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
