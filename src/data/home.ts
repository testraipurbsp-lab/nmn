export const introPillars = [
  { number: "01", title: "Strategy First", body: "Understand the problem before building the solution." },
  { number: "02", title: "Design With Purpose", body: "Create interfaces that feel intuitive, modern, and effortless." },
  { number: "03", title: "Engineering That Scales", body: "Build reliable digital products designed for long-term growth." },
] as const;

export const differentiators = [
  {
    title: "Built Around Your Business",
    body: "Scope, structure and features follow your goals, not a template we reuse for everyone.",
    spec: "requirements → architecture",
  },
  {
    title: "Modern Technology Stack",
    body: "Current, well-supported tools such as TypeScript, React and Next.js, chosen for the job.",
    spec: "typed · tested · maintained",
  },
  {
    title: "Performance & Scalability",
    body: "Fast first loads, efficient rendering and architecture that can take on growth.",
    spec: "core web vitals · caching",
  },
  {
    title: "Clean, Maintainable Engineering",
    body: "Readable, documented code that you or another developer can pick up and extend.",
    spec: "modular · documented",
  },
] as const;

export const processSteps = [
  { number: "01", title: "Discover", body: "Understand your business, goals, and requirements." },
  { number: "02", title: "Strategize", body: "Define the technical approach and project roadmap." },
  { number: "03", title: "Design", body: "Create an intuitive and visually refined experience." },
  { number: "04", title: "Develop", body: "Engineer, integrate, and test the solution." },
  { number: "05", title: "Launch", body: "Deploy, optimize, and support your product." },
] as const;

/** Only technologies we actually build with. */
export const technologies = [
  { name: "React", group: "Frontend" },
  { name: "Next.js", group: "Framework" },
  { name: "TypeScript", group: "Language" },
  { name: "Node.js", group: "Runtime" },
  { name: "Python", group: "Language" },
  { name: "PostgreSQL", group: "Database" },
  { name: "MongoDB", group: "Database" },
  { name: "Tailwind CSS", group: "Styling" },
  { name: "REST APIs", group: "Integration" },
  { name: "Cloud Platforms", group: "Infrastructure" },
] as const;

export const aboutPrinciples = [
  {
    title: "Understand first",
    body: "Good software starts with a clear picture of the problem. We ask questions early so the build is aimed at the right target.",
  },
  {
    title: "Build it properly",
    body: "Typed code, sensible architecture, and checks on the things that matter. Work that is easy to maintain is cheaper to own.",
  },
  {
    title: "Sweat the details",
    body: "Spacing, states, error messages, load times. The small things are what make a product feel trustworthy.",
  },
  {
    title: "Stay useful",
    body: "We measure success by whether the thing we built helps your business, not by how much we shipped.",
  },
] as const;
