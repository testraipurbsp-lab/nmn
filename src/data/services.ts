export type ServiceIconKey = "globe" | "terminal" | "app" | "bag" | "layers" | "workflow";

export type Service = {
  slug: string;
  number: string;
  icon: ServiceIconKey;
  title: string;
  /** Short description used on cards */
  summary: string;
  /** Value used in the contact form dropdown */
  formValue: string;
  overview: string;
  problems: string[];
  capabilities: string[];
  deliverables: string[];
  technologies: string[];
};

export const services: Service[] = [
  {
    slug: "website-development",
    number: "01",
    icon: "globe",
    title: "Website Development",
    summary: "Modern, responsive, high-performance websites that turn visitors into customers.",
    formValue: "Website Development",
    overview:
      "Business websites, landing pages and full redesigns, built to load fast, read clearly and make the next step obvious. Every site is designed around what your visitors need to decide.",
    problems: [
      "A site that looks dated or doesn't reflect the quality of your business",
      "Slow pages and poor mobile experience that lose visitors",
      "Traffic that doesn't turn into enquiries or sales",
      "A site that is hard to update without a developer",
    ],
    capabilities: [
      "Custom business websites",
      "Landing page development",
      "Website redesign & optimization",
      "Performance, SEO and accessibility foundations",
      "CMS or content workflows when you need to edit yourself",
      "Maintenance & technical support",
    ],
    deliverables: [
      "Responsive, tested website deployed to your hosting",
      "Reusable component and content structure",
      "Technical SEO setup and analytics integration",
      "Handover documentation",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  },
  {
    slug: "custom-software",
    number: "02",
    icon: "terminal",
    title: "Custom Software",
    summary: "Purpose-built software that solves unique business challenges and streamlines operations.",
    formValue: "Custom Software",
    overview:
      "When off-the-shelf tools bend your process out of shape, we build software that fits it. Internal tools, workflow systems and admin dashboards designed around how your team actually works.",
    problems: [
      "Teams juggling spreadsheets, chats and disconnected tools",
      "Manual steps that cause errors and delays",
      "Generic software that doesn't match your process",
      "No clear view of operations and data",
    ],
    capabilities: [
      "Internal tools and workflow systems",
      "Admin dashboards and reporting",
      "Role-based access and audit trails",
      "Data modelling and migrations",
      "Integrations with existing systems",
    ],
    deliverables: [
      "Working software deployed to your environment",
      "Documented data model and architecture",
      "User guidance for your team",
      "Source code and deployment notes",
    ],
    technologies: ["TypeScript", "Node.js", "Python", "PostgreSQL"],
  },
  {
    slug: "web-applications",
    number: "03",
    icon: "app",
    title: "Web Applications",
    summary: "Powerful web-based platforms with modern interfaces, workflows, and functionality.",
    formValue: "Web Application",
    overview:
      "Interactive, data-driven applications that run in the browser: customer portals, dashboards, booking and management platforms, with the interface polish users expect.",
    problems: [
      "An idea that needs more than a brochure website",
      "Complex workflows that need a clear, guided interface",
      "Users who need secure accounts and personal data",
      "Prototypes that can't grow into real products",
    ],
    capabilities: [
      "Authentication and user accounts",
      "Dashboards and data visualisation",
      "Real-time and background processing",
      "Payments and third-party services",
      "Responsive interfaces for desktop and mobile",
    ],
    deliverables: [
      "Production web application",
      "API and database layer",
      "Automated checks for critical flows",
      "Deployment pipeline setup",
    ],
    technologies: ["React", "Next.js", "TypeScript", "PostgreSQL", "REST APIs"],
  },
  {
    slug: "ecommerce-development",
    number: "04",
    icon: "bag",
    title: "E-commerce Development",
    summary: "Online stores designed for seamless shopping experiences and business growth.",
    formValue: "E-commerce",
    overview:
      "Online stores built for fast browsing and a short path to checkout, with product, order and inventory handling that suits how you sell.",
    problems: [
      "Shoppers leaving before checkout",
      "Slow product pages, especially on mobile",
      "Manual order and inventory handling",
      "A storefront that doesn't match your brand",
    ],
    capabilities: [
      "Custom storefront design and development",
      "Product catalogue, search and filtering",
      "Payment gateway integration",
      "Order management and notifications",
      "Shipping and inventory integrations",
    ],
    deliverables: [
      "Live storefront with admin tools",
      "Payment and order flows tested end to end",
      "Product import and content setup",
      "Hand-off training and documentation",
    ],
    technologies: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "REST APIs"],
  },
  {
    slug: "saas-development",
    number: "05",
    icon: "layers",
    title: "SaaS Development",
    summary: "Scalable software products built with thoughtful architecture and modern technology.",
    formValue: "SaaS Development",
    overview:
      "From first version to subscription-ready product. We help shape the scope, then build a foundation that can take on new features and customers without a rewrite.",
    problems: [
      "Unclear what to build first",
      "An MVP that won't scale past early users",
      "Billing, accounts and teams to design from scratch",
      "Technical debt before launch",
    ],
    capabilities: [
      "MVP scoping and product architecture",
      "Multi-tenant data design",
      "Subscriptions and billing integration",
      "Admin and customer dashboards",
      "Cloud deployment and monitoring",
    ],
    deliverables: [
      "Launch-ready product",
      "Architecture documentation",
      "Deployment and environment setup",
      "Roadmap for the next iterations",
    ],
    technologies: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Cloud Platforms"],
  },
  {
    slug: "api-automation",
    number: "06",
    icon: "workflow",
    title: "API & Automation",
    summary: "Connect systems, automate workflows, and eliminate repetitive processes.",
    formValue: "API & Automation",
    overview:
      "We build the connections between your tools and automate the repetitive work around them, so information moves on its own and your team spends time on what matters.",
    problems: [
      "Copying data between tools by hand",
      "Systems that don't talk to each other",
      "Reports that take hours to compile",
      "Processes that depend on one person remembering a step",
    ],
    capabilities: [
      "REST API design and development",
      "Third-party API integration",
      "Business process automation",
      "Scheduled jobs and data pipelines",
      "Webhooks and notification workflows",
    ],
    deliverables: [
      "Documented API or integration service",
      "Automated workflows running in production",
      "Error handling and alerting",
      "Runbook for your team",
    ],
    technologies: ["Node.js", "Python", "REST APIs", "PostgreSQL", "MongoDB"],
  },
];

export const serviceOptions = [...services.map((s) => s.formValue), "Other"] as const;

export const budgetOptions = [
  "Under ₹10,000",
  "₹10,000–₹25,000",
  "₹25,000–₹50,000",
  "₹50,000–₹1,00,000",
  "₹1,00,000+",
  "Not decided",
] as const;

export const timelineOptions = [
  "As soon as possible",
  "Within 1 month",
  "1–3 months",
  "3+ months",
  "Flexible",
] as const;
